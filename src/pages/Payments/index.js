import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as chakra from '@chakra-ui/react';
import moment from "moment";
import Zoom from 'react-medium-image-zoom'

import { AiOutlineSearch, AiOutlineCloseCircle, AiOutlineCheckCircle } from "react-icons/ai";
import { FiEye, FiX } from "react-icons/fi";

import Header from "../../components/molecules/Header";
import Button from "../../components/atoms/Button";
import Input from "../../components/atoms/Input";
import Select from "../../components/atoms/Select";
import Modal from "../../components/atoms/Modal";
import Pagination from '../../components/molecules/Pagination';

import { getUserInformations } from "../../services/authServices";
import { getAllPaymentsByDate, searchPaymentByCnpj, enablePayment, updatePaymentStatus } from '../../services/paymentServices';
import { formatCpfOrCnpj } from '../../utils/formatCpfAndCnpj';

import { PaymentStyles } from "./style";
const Payments = () => {

  const [userName, setUserName] = useState('');
  const [cityName, setCityName] = useState('');

  const [rows, setRows] = useState([]);

  const atualDay = moment().toDate().getUTCDate();
  const [initialDate, setInitialDate] = useState(moment().subtract(atualDay, 'days').format('yyyy/MM/DD'));
  const [finalDate, setFinalDate] = useState(moment().add(1, 'days').format('yyyy/MM/DD'));
  const [cnpjSearch, setCnpjSearch] = useState();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [countPages, setCountPages] = useState();

  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState();
  const [status, setStatus] = useState();
  const imagem = modalData?.tax_note_link;
  const statusOptions = [
    {label: 'Deferir'},
    {label: 'Indeferir'},
    {label: 'Atencao'}
  ];
  const navigate = useNavigate();
  const toast = chakra.useToast();
  const fromCurrency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });


  async function searchPayment () {
    setRows([]);
    if(cnpjSearch == '') {
      selectedPrefectureAndGetPayments();
    } else {
      const response = await searchPaymentByCnpj({ cnpj: cnpjSearch });
      if(response.body.length == undefined) {
        setRows([response.body]);
        setCountPages(response.meta.pageCount);
      } else {
        setRows(response.body);
        setCountPages(response.meta.pageCount);
      }
    }
  } 

  async function selectedPrefectureAndGetPayments () {

    const response = await getAllPaymentsByDate({
      initial_date: initialDate == undefined ? moment().subtract(atualDay, 'days').format('yyyy/MM/DD') : initialDate,
      final_date: finalDate == undefined ? moment().format('yyyy/MM/DD') : finalDate,
      city_id: '',
      pageCount: currentPage,
    });
    
    setRows(response.rows);
    setCountPages(response.meta.pageCount);
  }

  async function openAndCloseModal(data) {
    if(isOpen == true) {
      await updatePaymentStatus({ status: status.label, payment_id: modalData.id }).then(response => {
        navigate(0);
      })
      setIsOpen(!isOpen);
    } else {
      setModalData(data);
      setStatus({ label: data?.status });
      setIsOpen(!isOpen);
    }
  }

  function openDocumentInNewTab(link) {
    window.open(link, '_blank').focus()
  }

  async function auditPayment() {
    const objetctToAuditPayment = [{
      payment_id: modalData.id
    }];
    await enablePayment(objetctToAuditPayment).then(response => {
      toast({
        title: 'Pagamento Auditado com sucesso!',
        status: 'success',
        position: 'top-right',
        isClosable: true,
      });
      setIsOpen(false);
    }).catch(error => {
      toast({
        title: 'Houve um erro ao auditar esse pagamento!',
        status: 'error',
        position: 'top-right',
        isClosable: true,
      });
    });
  }

  useEffect(() => {
    setRows([]);
    (async () => {
      await getUserInformations().then(response => {
        setUserName(response.body.user_name);
        setCityName(response.body.city_name);
      });

      await selectedPrefectureAndGetPayments();
    })();
  }, [currentPage]);

  return (
    <section className={PaymentStyles.Container}>
      <Header userName={userName} cityName={cityName} />
      <div className={PaymentStyles.BodyContainer}>
        <div className={PaymentStyles.TitleContainer}>
          <h1 className='text-3xl font-semibold'>Pagamentos</h1>
          <div className='w-auto flex items-end mt-2'>
            <div className='w-72 mr-4'>
              <Input label='Pesquisar' placeholder='Pesquisar por CNPJ' value={cnpjSearch} onChange={e => setCnpjSearch(e.target.value)} />
            </div>
            <div className={PaymentStyles.TitleButtonContainer}>
              <Button label={<AiOutlineSearch />} onPress={searchPayment} isLoading={rows.length == 0 ? true : false} />
            </div>
          </div>
        </div>

        <div className={PaymentStyles.TableContainer}>

          <chakra.Skeleton className="w-full h-[60vh] mt-4" isLoaded={rows.length > 0 ? true : false}>
            <chakra.Table variant='simple' size='lg'>
              <chakra.Thead>
                <chakra.Tr>
                  <chakra.Th></chakra.Th>
                  <chakra.Th>Lançamento</chakra.Th>
                  <chakra.Th>Nome da empresa</chakra.Th>
                  <chakra.Th>CNPJ</chakra.Th>
                  <chakra.Th>UF</chakra.Th>
                  <chakra.Th>Município</chakra.Th>
                  <chakra.Th>Nota Fiscal</chakra.Th>
                </chakra.Tr>
              </chakra.Thead>

              <chakra.Tbody>
                {rows.map(rowsCalback => {
                  let rowBgColor;
                  let bgIndicator;

                  switch (rowsCalback.status) {
                    case null:
                      rowBgColor = 'bg-[#F5F5FA]';
                      bgIndicator = 'w-[10px] h-[40px] rounded bg-[#2F4ECC]'
                      break
                    case 'Deferir':
                      rowBgColor = 'bg-[#EEFFF4]';
                      bgIndicator = 'w-[10px] h-[40px] rounded bg-[#18BA18]'
                      break
                    case 'Atencao':
                      rowBgColor = 'bg-[#FFF5D2]';
                      bgIndicator = 'w-[10px] h-[40px] rounded bg-[#FFB800]';
                      break
                    case 'Indeferir':
                      rowBgColor = 'bg-[#FFE5E5]';
                      bgIndicator = 'w-[10px] h-[40px] rounded bg-[#BB0000]';
                      break
                  }
                  

                  return (
                    <chakra.Tr className={rowBgColor}>
                      <chakra.Td><div className={bgIndicator}></div></chakra.Td>
                      <chakra.Td>{moment(rowsCalback.createdAt).format('DD/MM/YYYY')}</chakra.Td>
                      <chakra.Td>{rowsCalback?.['company_id_payments.label']}</chakra.Td>
                      <chakra.Td>{formatCpfOrCnpj(rowsCalback.cnpj)}</chakra.Td>
                      <chakra.Td>{rowsCalback?.['city_id_payments.city_uf_id.label']}</chakra.Td>
                      <chakra.Td>{rowsCalback?.['city_id_payments.label']}</chakra.Td>
                      <chakra.Td>{rowsCalback.tax_note.split('-')[0]}</chakra.Td>
                      <chakra.Td><FiEye size={28} className='cursor-pointer' onClick={() => openAndCloseModal(rowsCalback)}/></chakra.Td>
                    </chakra.Tr>
                  )
                })}
                
              </chakra.Tbody>
            </chakra.Table>
          </chakra.Skeleton>

          <Modal isCentered size={'xl'} title={'Pagamento'} isOpen={isOpen} modalOpenAndClose={openAndCloseModal}>
            <div className={PaymentStyles.ModalBodyContainer}>
              <div className={PaymentStyles.ImageModalContainer}>
                {imagem?.indexOf('.pdf') == -1 ?
                  <div className={`w-full h-[36vh]`}>
                    <Zoom>
                      <img src={modalData?.tax_note_link} className='w-full h-[56vh] pb-2' />
                    </Zoom>
                  </div>
                  :
                  <div className={`w-full h-[36vh]`}>
                    <embed src={modalData?.tax_note_link} className={`w-full h-[56vh] pb-2`}></embed>
                  </div>
                }
              </div>
              <div className={PaymentStyles.ContentModalContainer}>
                <chakra.Tabs align='center' isFitted variant='enclosed'>
                  <chakra.TabList>
                    <chakra.Tab>Pagamento</chakra.Tab>
                    <chakra.Tab>Fornecedor</chakra.Tab>
                  </chakra.TabList>

                  <chakra.TabPanels>
                    <chakra.TabPanel>
                      <div className={PaymentStyles.PaymentContentContainer}>
                        <div className='flex flex-col items-start'>
                          <span className='font-semibold text-lg'>Dados da nota fiscal</span>
                          <div className='flex'>
                            <div className='flex flex-col w-72 p-2 bg-[#F2F5FF] items-start rounded mr-2'>
                              <span className='font-semibold'>Número da Nota fiscal</span>
                              <span>{modalData?.tax_note.split('-')[0]}</span>
                            </div>
                            <div className='flex flex-col w-72 p-2 bg-[#F2F5FF] items-start rounded'>
                              <span className='font-semibold'>Número de série Nota Fiscal</span>
                              <span>{modalData?.tax_note_serie}</span>
                            </div>
                          </div>
                        </div>

                        <div className='flex flex-col items-start mt-2'>
                          <span className='font-semibold'>Status</span>
                          <div className='w-full flex justify-between items-center'>
                            
                            { modalData?.enabled ? 
                              <div className="w-60 rounded border border-[#18BA18] bg-[#e8f9e8] p-2">
                                <span className="font-semibold text-[#18BA18]">Pagamento Auditado</span>
                              </div>
                              :
                                <div className='flex flex-col w-60'>
                                    <Button label='Auditar Pagamento'onPress={auditPayment} />
                                </div>
                            }
                            
                            <div className="w-72">
                              <Select options={statusOptions} setSelectedValue={setStatus} selectedValue={status} />
                            </div>
                          </div>
                        </div>

                        <div className='flex w-full justify-between mt-2'>
                          <div className='flex flex-col items-start justify-start mr-2'>
                            <span className='font-semibold text-lg'>Dados do pagador</span>
                            <div className='flex flex-col'>
                              <div className='flex flex-col w-72 p-2 bg-[#F2F5FF] items-start rounded mb-2'>
                                <span className='font-semibold'>Município</span>
                                <span>{modalData?.['city_id_payments.label']}</span>
                              </div>
                              <div className='flex flex-col w-72 p-2 bg-[#F2F5FF] items-start rounded mb-2'>
                                <span className='font-semibold'>CNPJ</span>
                                <span>{modalData?.['computer_id_payments.cnpj']}</span>
                              </div>
                              <div className='flex flex-col w-72 p-2 bg-[#F2F5FF] items-start rounded'>
                                <span className='font-semibold'>Ordenador de despesa</span>
                                <span>{modalData?.['computer_id_payments.label']}</span>
                              </div>
                            </div>
                          </div>
                          <div className='flex flex-col items-start justify-start'>
                            <span className='font-semibold text-lg'>Dados do Fornecedor</span>
                            <div className='flex flex-col'>
                              <div className='flex flex-col w-72 p-2 bg-[#F2F5FF] items-start rounded mb-2 text-left'>
                                <span className='font-semibold'>Nome/Razão social</span>
                                <span>{modalData?.['company_id_payments.label']}</span>
                              </div>
                              <div className='flex flex-col w-72 p-2 bg-[#F2F5FF] items-start rounded mb-2'>
                                <span className='font-semibold'>CNPJ</span>
                                <span>{formatCpfOrCnpj(modalData?.cnpj)}</span>
                              </div>
                              <div className='flex flex-col w-72 p-2 bg-[#F2F5FF] items-start rounded'>
                                <span className='font-semibold'>Competência</span>
                                <span>{moment(modalData?.createdAt).format('MMMM [de] YYYY')}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col w-full mt-4 items-start">
                          <span className="font-semibold text-lg">Memória de Cálculo</span>
                          <div className="flex w-[32vw] p-2 bg-[#F2F5FF] items-center justify-between rounded ">
                            <span className="font-semibold">Crédito / Pagamento</span>
                            <span>{fromCurrency.format(modalData?.value)}</span>
                          </div>
                          <div className="flex w-[32vw] p-2 bg-[#F2F5FF] items-center justify-between rounded mt-2">
                            <span className="font-semibold">Base de Cálculo da Retenção</span>
                            <span>{fromCurrency.format(modalData?.calculation_basis)}</span>
                          </div>

                          <div className="flex w-[32vw] p-2 bg-[#F2F5FF] items-center justify-between rounded mt-2">
                            <span className="font-semibold">{modalData?.type == 'simples' ? 'Aliquota do Imposto Sobre Serviço Retido na Fonte' : 'Alíquota do Imposto de Renda Retido na Fonte'}</span>
                            <span>{modalData?.index} %</span>
                          </div>

                          <div className="flex w-[32vw] p-2 bg-[#F2F5FF] items-center justify-between rounded mt-2">
                            <span className="font-semibold">{ modalData?.type == 'simples' ? 'Valor do ISS Retido na fonte': 'Valor do IR Retido na Fonte'}</span>
                            <span>{fromCurrency.format(modalData?.withheld_tax)}</span>
                          </div>

                          <div className="flex w-[32vw] p-2 bg-[#F2F5FF] items-center justify-between rounded mt-2">
                            <span className="font-semibold">Valor do Saldo de Pagamento</span>
                            <span>{fromCurrency.format(modalData?.net_of_tax)}</span>
                          </div>

                        </div>
                      </div>
                    </chakra.TabPanel>
                    <chakra.TabPanel>
                      <div className={PaymentStyles.PaymentContentContainer}>
                        <div className='flex flex-col items-start'>
                          <span className='font-semibold text-lg'>Dados do Fornecedor</span>
                          <div className='flex'>
                            <div className='flex flex-col w-72 p-2 bg-[#F2F5FF] items-start rounded mr-2'>
                              <span className='font-semibold'>Nome</span>
                              <span>{modalData?.['company_id_payments.label']}</span>
                            </div>
                            <div className='flex flex-col w-72 p-2 bg-[#F2F5FF] items-start rounded'>
                              <span className='font-semibold'>CNPJ</span>
                              <span>{formatCpfOrCnpj(modalData?.['company_id_payments.cnpj'])}</span>
                            </div>
                          </div>
                          <div className='flex mt-2'>
                            <div className='flex flex-col w-[30.5vw] p-2 bg-[#F2F5FF] items-start rounded mr-2'>
                              <span className='font-semibold'>Objeto do contrato</span>
                              <span>{modalData?.['company_id_payments.object']}</span>
                            </div>
                          </div>
                          <div className='flex w-full mt-2'>
                            <div className='flex p-2 bg-[#ededed] rounded items-center justify-center mr-2'>
                              {modalData?.['company_id_payments.is_simple'] == true ? <AiOutlineCheckCircle size={20} color={'#18BA18'}/> : <AiOutlineCloseCircle size={20} color={'#BB0000'}/>}
                              <span className='font-semibold ml-2'>Simples</span>
                            </div>
                            <div className='flex p-2 bg-[#ededed] rounded items-center justify-center mr-2'>
                              {modalData?.['company_id_payments.is_service'] == true ? <AiOutlineCheckCircle size={20} color={'#18BA18'}/> : <AiOutlineCloseCircle size={20} color={'#BB0000'}/>}
                              <span className='font-semibold ml-2'>Fornece Serviços</span>
                            </div>
                            <div className='flex p-2 bg-[#ededed] rounded items-center justify-center'>
                              {modalData?.['company_id_payments.is_product'] == true ? <AiOutlineCheckCircle size={20} color={'#18BA18'}/> : <AiOutlineCloseCircle size={20} color={'#BB0000'}/>}
                              <span className='font-semibold ml-2'>Fornece Produtos</span>
                            </div>
                          </div>

                          <div className='flex w-full mt-2'>
                            <div className='flex p-2 bg-[#ededed] rounded items-center justify-center mr-2'>
                              {modalData?.['company_id_payments.is_exempt_irrf'] == true ? <AiOutlineCheckCircle size={20} color={'#18BA18'}/> : <AiOutlineCloseCircle size={20} color={'#BB0000'}/>}
                              <span className='font-semibold ml-2'>Isento IR</span>
                            </div>
                            <div className='flex p-2 bg-[#ededed] rounded items-center justify-center mr-2'>
                              {modalData?.['company_id_payments.is_exempt_iss'] == true ? <AiOutlineCheckCircle size={20} color={'#18BA18'}/> : <AiOutlineCloseCircle size={20} color={'#BB0000'}/>}
                              <span className='font-semibold ml-2'>Isento ISS</span>
                            </div>
                            <div className='flex p-2 bg-[#ededed] rounded items-center justify-center mr-2'>
                              {modalData?.['company_id_payments.is_immune_irrf'] == true ? <AiOutlineCheckCircle size={20} color={'#18BA18'}/> : <AiOutlineCloseCircle size={20} color={'#BB0000'}/>}
                              <span className='font-semibold ml-2'>Imune IR</span>
                            </div>
                            <div className='flex p-2 bg-[#ededed] rounded items-center justify-center'>
                              {modalData?.['company_id_payments.is_immune_iss'] == true ? <AiOutlineCheckCircle size={20} color={'#18BA18'}/> : <AiOutlineCloseCircle size={20} color={'#BB0000'}/>}
                              <span className='font-semibold ml-2'>Imune ISS</span>
                            </div>
                          </div>

                          {modalData?.['company_id_payments.receipt_link'] != null ?
                            <div className="w-72 mt-4">
                              <Button label="Baixar Objeto de contratação" onPress={() => openDocumentInNewTab(modalData?.['company_id_payments.receipt_link'])}/>
                            </div>
                            :
                            <></>
                          }
                        </div>
                      </div>
                    </chakra.TabPanel>
                  </chakra.TabPanels>
                </chakra.Tabs>
              </div>
            </div>
          </Modal>
        </div>
        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pages={countPages} />
      </div>
    </section>
  )
}

export default Payments;