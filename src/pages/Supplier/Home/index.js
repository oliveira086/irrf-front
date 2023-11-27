import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import * as chakra from '@chakra-ui/react';
import { FiEye, FiDownload } from 'react-icons/fi';
import moment from 'moment/moment';
import 'moment/locale/pt-br';
import { Player } from '@lottiefiles/react-lottie-player';

import Header from '../../../components/molecules/Header';
import Button from '../../../components/atoms/Button';
import Modal from '../../../components/atoms/Modal';
import Input from '../../../components/atoms/Input';
import Pagination from '../../../components/molecules/Pagination';

import { formatCpfOrCnpj } from '../../../utils/formatCpfAndCnpj'

import { getUserInformations } from '../../../services/authServices';
import { getSecretaryPayments } from '../../../services/paymentServices';
import { companyPanel, companyInformations } from '../../../services/companyServices';

import { SupplierHomeStyle } from './style';

const SupplierHome = () => {
  const [paymentsData, setPaymentsData] = useState([]);
  const [userName, setUserName] = useState('');
  const [cityName, setCityName] = useState('');

  const [modalData, setModalData] = useState();
  const [isOpen, setIsOpen] = useState();

  const [currentPage, setCurrentPage] = useState(1);
  const [countPages, setCountPages] = useState(1);

  const [isLoading, setIsLoading] = useState(false);

  moment.locale('pt-br');
  const fromCurrency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
  const toast = chakra.useToast();
  const navigate = useNavigate();
  
  function openAndCloseModal () {
    setIsOpen(!isOpen);
  }

  function generateDocument (item) {
    sessionStorage.setItem('payment_id', item);
    navigate('/extrato-fornecedor'); 
  }

  function validatePayment () {
    toast({
      title: 'O Extrato de retenção é exclusivo IR Retido na Fonte!',
      status: 'error',
      position: 'top-right',
      isClosable: true,
    });
  }

  useEffect(() => {
    (async () => await companyInformations({ currentPage: 1 }).then(response => {
      setUserName(response?.body?.company_name);
    }))()
  }, []);

  useEffect(() => {
    const paymentInserted = new Set();
    const paymentsArray = [];
    setIsLoading(false);

    (async () => await companyPanel({ currentPage: currentPage }).then(response => {
      setCountPages(response?.body?.meta?.pageCount);

      response.body.rows.map(paymentCallback => {
        if(paymentInserted.has(`${paymentCallback.tax_note}`.substring(0, paymentCallback.tax_note.length -1 )) == false) {
          paymentsArray.push(paymentCallback);
          paymentInserted.add(`${paymentCallback.tax_note}`.substring(0, paymentCallback.tax_note.length -1 ));
        }
      });

      setPaymentsData(paymentsArray);
      
    }))()
    setIsLoading(true);
  }, [currentPage]);

  return (
    <section className={SupplierHomeStyle.Container}>
      <Header userName={userName} cityName={cityName} />
      <div className={SupplierHomeStyle.BodyContainer}>
        <div className={SupplierHomeStyle.TitleContainer}>
          <h1>Central de Retenção</h1>
        </div>
      </div>

    </section>
  );
}

export default SupplierHome;