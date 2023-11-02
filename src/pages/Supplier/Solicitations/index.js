import { useState, useEffect } from 'react';
import { Form, useNavigate } from "react-router-dom";
import * as chakra from '@chakra-ui/react';
import { Player } from '@lottiefiles/react-lottie-player';
import { FiEye, FiEdit } from 'react-icons/fi';
import moment from 'moment/moment';
import 'moment/locale/pt-br';

import Select from 'react-select'

import Header from '../../../components/molecules/Header';
import Input from '../../../components/atoms/Input';
import Button from '../../../components/atoms/Button';
import Pagination from '../../../components/molecules/Pagination';

import { companyInformations, getCompanyCities, getCompanyByCnpj, getAllPaymentSolicitations } from '../../../services/companyServices';

import { SolicitationsStyle } from './style';

const Soliciations = () => {
  const [userName, setUserName] = useState('');
  const [cityName, setCityName] = useState('');
  const [cnpj, setCNPJ] = useState('');
  const [paymentSolicitations, setPaymentSolicitations] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [countPages, setCountPages] = useState(1);


  useEffect(() => {
    (async () => await getAllPaymentSolicitations({ currentPage: 1 }).then(async response => {
      setUserName(response?.body?.company_name);
      setCNPJ(response?.body?.cnpj);
      setPaymentSolicitations(response?.body?.rows);
      
    }))()
    setIsLoading(true);

  }, []);

  return (
    <section className={SolicitationsStyle.Container}>
      <Header userName={userName} cityName={cityName} />
      <div className={SolicitationsStyle.BodyContainer}>
        <div className={SolicitationsStyle.TitleContainer}>
          <h1 className='text-3xl font-semibold'>Solicitações de pagamento</h1>
        </div>

        <div className='w-full h-auto'>
          {
            paymentSolicitations.length > 0 ? 
            <div className={SolicitationsStyle.TableContainer}>
              <chakra.Skeleton className="w-full h-auto" isLoaded={isLoading}>
                <chakra.TableContainer>
                  <chakra.Table variant='simple' size='lg'>
                    <chakra.Thead>
                      <chakra.Tr>
                        <chakra.Th>ID</chakra.Th>
                        <chakra.Th>Data</chakra.Th>
                        <chakra.Th>Cidade</chakra.Th>
                        <chakra.Th>Status</chakra.Th>
                        <chakra.Th></chakra.Th>
                        <chakra.Th></chakra.Th>
                      </chakra.Tr>
                    </chakra.Thead>
                    <chakra.Tbody>
                      {paymentSolicitations.map(paymentSolicitationsCallback => {
                        
                        console.log(paymentSolicitationsCallback)
                        return (
                          <>
                            <chakra.Tr>
                              <chakra.Td>{paymentSolicitationsCallback.id}</chakra.Td>
                              <chakra.Td>{moment(paymentSolicitationsCallback.createdAt).format('DD/MM/YYYY')}</chakra.Td>
                              <chakra.Td>{paymentSolicitationsCallback?.['city_id_payments_solicitations.label']}</chakra.Td>
                              <chakra.Td>{paymentSolicitationsCallback?.status}</chakra.Td>
                              <chakra.Td><FiEye size={28} className='cursor-pointer' /></chakra.Td>
                              <chakra.Td><FiEdit size={28} className='cursor-pointer' /></chakra.Td>
                            </chakra.Tr>
                          </>
                        )

                      })}
                    </chakra.Tbody>
                  </chakra.Table>
                  <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pages={countPages} />
                </chakra.TableContainer>
              </chakra.Skeleton>
              
            </div>
            :
            <div className='flex flex-col w-5/12 h-full items-center justify-center'>
              <Player
                src='https://assets8.lottiefiles.com/private_files/lf30_fn9xcfqg.json'
                className="player"
                loop
                autoplay
              />
              <span className='text-[#999] font-semibold'>Não foram encontrados registros</span>
            </div>
          }
        </div>
      </div>
    </section>
  )
}

export default Soliciations;