import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import * as chakra from '@chakra-ui/react';
import { FiEye, FiDownload } from 'react-icons/fi';
import moment from 'moment/moment';
import 'moment/locale/pt-br';
import { Player } from '@lottiefiles/react-lottie-player';

import Header from '../../components/molecules/Header';
import Button from '../../components/atoms/Button';
import Modal from '../../components/atoms/Modal';
import Pagination from '../../components/molecules/Pagination';

import { getUserInformations } from '../../services/authServices';

import { HomeStyle } from './style';

const HomeAdmin = () => {
  const [paymentsData, setPaymentsData] = useState([]);
  const [userName, setUserName] = useState('');
  const [cityName, setCityName] = useState('');
  const [modalData, setModalData] = useState();
  const [isOpen, setIsOpen] = useState();

  const [currentPage, setCurrentPage] = useState(1);
  const [countPages, setCountPages] = useState(1);

  moment.locale('pt-br');
  const fromCurrency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
  const navigate = useNavigate();

  function openAndCloseModal () {
    setIsOpen(!isOpen);
  }
  
  useEffect(() => {
    const paymentInserted = new Set();
    const paymentsArray = [];
    

    (async () => await getUserInformations({ currentPage: currentPage }).then(response => {
      setCountPages(response.body.meta.pageCount);
      setCurrentPage(response.body.meta.currentPage);

      setUserName(response.body.user_name);
      setCityName(response.body.city_name);

      response.body.rows.map(paymentCallback => {
        if(paymentInserted.has(`${paymentCallback.tax_note}`.substring(0, paymentCallback.tax_note.length -1 )) == false) {
          paymentsArray.push(paymentCallback);
          paymentInserted.add(`${paymentCallback.tax_note}`.substring(0, paymentCallback.tax_note.length -1 ));
        }
      });

      setPaymentsData(paymentsArray);

    }))()
  }, [currentPage]);

  return (
    <section className={HomeStyle.Container}>
      <Header userName={userName} cityName={cityName} />
      <div className={HomeStyle.BodyContainer}>
        <div className={HomeStyle.TitleContainer}>
          <h1>Central de Renteção</h1>
          <div className={HomeStyle.TitleButtonContainer}>
            <Button label='Nova Retenção' onPress={() => navigate('/retencao')}/>
          </div>
        </div>

        <Modal isCentered size={'xl'} title={modalData?.company_name} isOpen={isOpen} modalOpenAndClose={openAndCloseModal}>
          <div className='h-auto'>
            <div className='flex justify-between'>
              <div className='w-96 h-full'>
                <span className='text-xl'>Dados do Pagador</span>

                <div className='flex flex-col w-full h-auto rounded bg-[#F2F5FF] p-2 mt-2'>
                  <span className='font-semibold'>Município</span>
                  <span>{`Prefeitura Municipal de ${modalData?.computer_id_payments.computer_city_id.label} - ${modalData?.computer_id_payments.computer_city_id.city_uf_id.label}`}</span>
                </div>

                <div className='flex flex-col w-full h-auto rounded bg-[#F2F5FF] p-2 mt-2'>
                  <span className='font-semibold'>CNPJ</span>
                  <span>{modalData?.computer_id_payments.computer_city_id.cnpj}</span>
                </div>

                <div className='flex flex-col w-full h-auto rounded bg-[#F2F5FF] p-2 mt-2'>
                  <span className='font-semibold'>Ordenador de despesa</span>
                  <span>{modalData?.computer_id_payments.label}</span>
                </div>
              </div>

              <div className='w-96 h-full'>
                <span className='text-xl'>Dados do Fornecedor</span>

                <div className='flex flex-col w-full h-auto rounded bg-[#F2F5FF] p-2 mt-2'>
                  <span className='font-semibold'>Nome / Razão social</span>
                  <span>{modalData?.company_name}</span>
                </div>

                <div className='flex flex-col w-full h-auto rounded bg-[#F2F5FF] p-2 mt-2'>
                  <span className='font-semibold'>CNPJ</span>
                  <span>{modalData?.cnpj}</span>
                </div>

                <div className='flex flex-col w-full h-auto rounded bg-[#F2F5FF] p-2 mt-2'>
                  <span className='font-semibold'>Competência</span>
                  <span>{moment(modalData?.createdAt).format('LL') }</span>
                </div>
              </div>
            </div>
            <div className='flex flex-col mt-4 pb-2 h-[40vh] overflow-y-scroll'>
              <span className='text-xl'>Memória de cálculo da retenção</span>
        
              {
                modalData?.type == 'ordinario' ?
                <>
                  <span>Imposto de Renda Retido na Fonte</span>
                  <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                    <span className='font-semibold'>Base de cálculo da retenção</span>
                    <span>{fromCurrency.format(modalData?.calculation_basis)}</span>
                  </div>
                  <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                    <span className='font-semibold'>Alíquota do Imposto de Renda</span>
                    <span>{modalData?.index}%</span>
                  </div>

                  <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                    <span className='font-semibold'>Valor do IRRF Retido na Fonte</span>
                    <span>{fromCurrency.format(modalData?.withheld_tax)}</span>
                  </div>

                  <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                    <span className='font-semibold'>Valor do Saldo de Pagamento</span>
                    <span>{fromCurrency.format(modalData?.net_of_tax)}</span>
                  </div>

                  {
                    modalData?.payment_associate !== null ?
                    <>
                      <span>Imposto Sobre Serviço Retido na Fonte</span>
                      <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                        <span className='font-semibold'>Base de cálculo da retenção</span>
                        <span>{fromCurrency.format(modalData?.payment_associate_id.calculation_basis)}</span>
                      </div>
                      <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                        <span className='font-semibold'>Alíquota do Imposto Sobre Serviço de Qualquer Natureza</span>
                        <span>{modalData?.payment_associate_id.index}%</span>
                      </div>

                      <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                        <span className='font-semibold'>Valor do ISS Retido na Fonte</span>
                        <span>{fromCurrency.format(modalData?.payment_associate_id.withheld_tax)}</span>
                      </div>

                      <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                        <span className='font-semibold'>Valor do Saldo de Pagamento</span>
                        <span>{fromCurrency.format(modalData?.payment_associate_id.net_of_tax)}</span>
                      </div>
                    </>
                    :
                    <></>
                  }

                </>
                :
                <>
                  <span>Imposto Sobre Serviço Retido na Fonte</span>
                  <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                    <span className='font-semibold'>Base de cálculo da retenção</span>
                    <span>{fromCurrency.format(modalData?.calculation_basis)}</span>
                  </div>
                  <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                    <span className='font-semibold'>Alíquota do Imposto Sobre Serviço de Qualquer Natureza</span>
                    <span>{modalData?.index}%</span>
                  </div>

                  <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                    <span className='font-semibold'>Valor do ISS Retido na Fonte</span>
                    <span>{fromCurrency.format(modalData?.withheld_tax)}</span>
                  </div>

                  <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                    <span className='font-semibold'>Valor do Saldo de Pagamento</span>
                    <span>{fromCurrency.format(modalData?.net_of_tax)}</span>
                  </div>

                  {
                    modalData?.payment_associate !== null ?
                    <>
                      <span>Imposto de Renda Retido na Fonte</span>
                      <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                        <span className='font-semibold'>Base de cálculo da retenção</span>
                        <span>{fromCurrency.format(modalData?.payment_associate_id.calculation_basis)}</span>
                      </div>
                      <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                        <span className='font-semibold'>Alíquota do Imposto de Renda Retido na Fonte</span>
                        <span>{modalData?.payment_associate_id.index}%</span>
                      </div>

                      <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                        <span className='font-semibold'>Valor do IRRF Retido na Fonte</span>
                        <span>{fromCurrency.format(modalData?.payment_associate_id.withheld_tax)}</span>
                      </div>

                      <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                        <span className='font-semibold'>Valor do Saldo de Pagamento</span>
                        <span>{fromCurrency.format(modalData?.payment_associate_id.net_of_tax)}</span>
                      </div>
                    </>
                    :
                    <></>
                  }
                  
                </>
              }
              <div className='flex w-full bg-[#F2F5FF] p-2 mt-6 rounded justify-between border-2'>
                <span className='font-semibold'>Valor Total do Saldo de Pagamento</span>
                <span>{fromCurrency.format( Number(modalData?.value) - (Number(modalData?.withheld_tax) + Number(modalData?.payment_associate_id?.withheld_tax)))}</span>
              </div>
            </div>
          </div>
        </Modal>

        {
          paymentsData.length > 0 ? 
          <div className={HomeStyle.TableContainer}>
            <chakra.TableContainer>
              <chakra.Table variant='simple' size='lg'>
                <chakra.Thead>
                  <chakra.Tr>
                    <chakra.Th>Nota fiscal</chakra.Th>
                    <chakra.Th>Data</chakra.Th>
                    <chakra.Th>Empresa</chakra.Th>
                    <chakra.Th></chakra.Th>
                    <chakra.Th></chakra.Th>
                  </chakra.Tr>
                </chakra.Thead>
                <chakra.Tbody>
                  {paymentsData.map(paymentsDataCallback => {
                    return (
                      <>
                        <chakra.Tr>
                          <chakra.Td>{paymentsDataCallback.tax_note.split('-')[0]}</chakra.Td>
                          <chakra.Td>{moment(paymentsDataCallback.createdAt).format('DD/MM/YYYY')}</chakra.Td>
                          <chakra.Td>{paymentsDataCallback.company_name}</chakra.Td>
                          <chakra.Td><FiEye size={28} className='cursor-pointer' onClick={() => {openAndCloseModal(); setModalData(paymentsDataCallback)}}/></chakra.Td>
                          <chakra.Td><FiDownload size={28} className='cursor-pointer' onClick={() => {sessionStorage.setItem('payment_id', paymentsDataCallback.id); navigate('/despacho')}} /></chakra.Td>
                        </chakra.Tr>
                      </>
                    )
                  })}
                </chakra.Tbody>
              </chakra.Table>
              <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pages={countPages} />
            </chakra.TableContainer>
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
    </section>
  )
};

export default HomeAdmin;