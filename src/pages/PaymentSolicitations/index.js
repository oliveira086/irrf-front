import { useState, useEffect } from 'react';
import { Form, useNavigate } from "react-router-dom";
import * as chakra from '@chakra-ui/react';
import { Player } from '@lottiefiles/react-lottie-player';
import { FiEye, FiEdit } from 'react-icons/fi';
import moment from 'moment/moment';
import 'moment/locale/pt-br';

import Header from '../../components/molecules/Header';
import Button from '../../components/atoms/Button';
import Pagination from '../../components/molecules/Pagination';
import Modal from "../../components/atoms/Modal";

import { getAllPaymentSolicitationByCity, acceptPaymentSolicitation, rejectPaymentSolicitation } from '../../services/companyServices';

import { PaymentSolicitationsStyle } from './style';

const PaymentSoliciations = () => {
  const toast = chakra.useToast();
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [cityName, setCityName] = useState('');

  const [paymentSolicitations, setPaymentSolicitations] = useState([]);
  const [showModalView, setShowModalView] = useState(false);
  const [modalViewData, setModalViewData] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [countPages, setCountPages] = useState(1);

  const [comment, setComment] = useState(modalViewData?.comment);

  const fromCurrency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

  useEffect(() => {
    (async () => await getAllPaymentSolicitationByCity({ currentPage: 1 }).then(async response => {
      setUserName(response?.body?.name);
      setCityName(response?.body.city);
      setPaymentSolicitations(response?.body?.rows);
      
    }))()
    setIsLoading(true);
  }, []);

  const openModalAndSetData = (modalData) => {
    setModalViewData(modalData);
    setShowModalView(true);
    setComment(modalData.comment)
  }

  const handlerRejectPaymentSolicitation = async (id) => {

    const objectToReset = {
      id: id,
      comment: comment
    }

    await rejectPaymentSolicitation(objectToReset).then(response => {
      
      toast({
        title: 'Pagamento indeferido!',
        status: 'success',
        position: 'top-right',
        isClosable: true
      });

      setShowModalView(false);

    }).catch(error => {
      console.log(error);
    })

  }

  const handlerAcceptPaymentSolicitation = async (id) => {

    const objectToAccept = {
      id: id,
      comment: comment
    }

    await acceptPaymentSolicitation(objectToAccept).then(response => {
      setShowModalView(false);
      navigate(0);
    
    }).catch(error => {
      console.log(error);
    })
  }

  return (
    <section className={PaymentSolicitationsStyle.Container}>
      <Header userName={userName} cityName={cityName} />
      <div className={PaymentSolicitationsStyle.BodyContainer}>
        <div className={PaymentSolicitationsStyle.TitleContainer}>
          <h1 className='text-3xl font-semibold'>Solicitações de pagamento</h1>
        </div>

        <div className='flex w-full h-auto justify-center'>
          {
            paymentSolicitations.length > 0 ? 
            <div className={PaymentSolicitationsStyle.TableContainer}>
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
                        
                        return (
                          <>
                            <chakra.Tr>
                              <chakra.Td>{paymentSolicitationsCallback.id}</chakra.Td>
                              <chakra.Td>{moment(paymentSolicitationsCallback.createdAt).format('DD/MM/YYYY')}</chakra.Td>
                              <chakra.Td>{paymentSolicitationsCallback?.['city_id_payments_solicitations.label']}</chakra.Td>
                              <chakra.Td>{paymentSolicitationsCallback?.status}</chakra.Td>
                              <chakra.Td><FiEye size={28} className='cursor-pointer' onClick={() => openModalAndSetData(paymentSolicitationsCallback)} /></chakra.Td>
                            </chakra.Tr>
                          </>
                        )

                      })}
                    </chakra.Tbody>
                  </chakra.Table>
                  <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pages={countPages} />
                </chakra.TableContainer>
              </chakra.Skeleton>

              <Modal isCentered size={'xl'} title={`Solicitação de pagamento - ${modalViewData?.['city_id_payments_solicitations.label']}`} isOpen={showModalView} modalOpenAndClose={() => setShowModalView(!showModalView)}>
                <div className="pb-8">
                  <div className='flex'>
                    <div className='flex flex-col w-96 p-2 bg-[#F2F5FF] items-start rounded mr-2'>
                      <span className='font-semibold'>Nome da Empresa</span>
                      <span>{modalViewData?.['company_id_payments_solicitations.label']}</span>
                    </div>
                    <div className='flex flex-col w-auto p-2 bg-[#F2F5FF] items-start rounded mr-2'>
                      <span className='font-semibold'>CNPJ</span>
                      <span>{modalViewData?.cnpj}</span>
                    </div>
                    <div className='flex flex-col w-auto p-2 bg-[#F2F5FF] items-start rounded mr-2'>
                      <span className='font-semibold'>Número da Nota fiscal</span>
                      <span>{modalViewData?.tax_note.split('-')[0]}</span>
                    </div>
                    <div className='flex flex-col w-auto p-2 bg-[#F2F5FF] items-start rounded'>
                      <span className='font-semibold'>Número de série Nota Fiscal</span>
                      <span>{modalViewData?.tax_note_serie}</span>
                    </div>
                  </div>

                  <div className='flex mt-4'>
                    <div className='flex flex-col w-auto p-2 bg-[#F2F5FF] items-start rounded mr-2'>
                      <span className='font-semibold'>Valor</span>
                      <span>{fromCurrency.format(modalViewData?.value)}</span>
                    </div>
                    <div className='flex flex-col w-auto p-2 bg-[#F2F5FF] items-start rounded mr-2'>
                      <span className='font-semibold'>Status</span>
                      <span>{modalViewData?.status}</span>
                    </div>
                    <div className='flex flex-col w-auto p-2 bg-[#F2F5FF] items-start rounded mr-2'>
                      <span className='font-semibold'>Entidade Pagadora</span>
                      <span>{modalViewData?.['computer_id_payments_solicitations.label']}</span>
                    </div>
                    <div className='flex flex-col w-auto p-2 bg-[#F2F5FF] items-start rounded'>
                      <span className='font-semibold'>Mês da despesa</span>
                      <span>{modalViewData?.month} de {modalViewData?.year}</span>
                    </div>
                  </div>

                  <div className='flex mt-4'></div>

                  <div className='flex mt-4'>
                    <div className='flex flex-col w-96 p-2 bg-[#F2F5FF] items-start rounded mr-2'>
                      <span className='font-semibold'>Responsável pela solicitação</span>
                      <span>{modalViewData?.responsible}</span>
                    </div>
                    <div className='flex flex-col w-96 p-2 bg-[#F2F5FF] items-start rounded'>
                      <span className='font-semibold'>Cargo do responsável</span>
                      <span>{modalViewData?.responsible_office}</span>
                    </div>
                  </div>

                  <div className='flex mt-4'>
                    <div className='flex w-60 h-12 bg-[#f2f5ff] border-dashed border-2
                    border-[#2F4ECC] rounded-lg items-center justify-center mr-2 cursor-pointer' onClick={() => window.open(modalViewData?.tax_note_link, 'Download')} >
                      <span className='font-semibold'>Baixar Nota fiscal</span>
                    </div>

                    <div className='flex w-60 h-12 bg-[#f2f5ff] border-dashed border-2
                    border-[#2F4ECC] rounded-lg items-center justify-center mr-2 cursor-pointer' onClick={() => window.open(modalViewData?.certificates_link, 'Download')}>
                      <span className='font-semibold'>Baixar Certidões</span>
                    </div>
                    
                    {
                      modalViewData?.outher_document_link == null ?
                      <></>
                      :
                      <div className='flex w-60 h-12 bg-[#f2f5ff] border-dashed border-2 border-[#2F4ECC] rounded-lg items-center justify-center'>
                        <span className='font-semibold'>Baixar Anexo</span>
                      </div>
                    }
                  </div>
                  
                  <div className='w-full h-40 mt-4'>
                    <span className='font-semibold'>Motivo para indeferimento</span>
                    <chakra.Textarea className="h-full" placeholder='Adicione um comentário que ajude a resolver o problema' value={comment} onChange={e => setComment(e.target.value)} />
                  </div>

                  <div className='w-full flex mt-8 h-auto justify-end'>
                    <div className='w-56 mr-10'>
                      <Button label='Indeferir' type='second' onPress={ () => handlerRejectPaymentSolicitation(modalViewData.id) }/>
                    </div>
                    <div className='w-56'>
                      <Button label='Deferir' onPress={ () => handlerAcceptPaymentSolicitation(modalViewData.id) } />
                    </div>
                  </div>
                </div>
              </Modal>
              
            </div>
            :
            <div className='flex flex-col w-5/12 h-full items-center justify-center mt-32'>
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

export default PaymentSoliciations;