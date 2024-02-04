import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as chakra from '@chakra-ui/react';
import moment from "moment";
import { Player } from '@lottiefiles/react-lottie-player';
import Zoom from 'react-medium-image-zoom'

import { AiOutlineSearch, AiOutlineCloseCircle, AiOutlineCheckCircle } from "react-icons/ai";
import { FiEye, FiX, FiEdit } from "react-icons/fi";

import Header from "../../components/molecules/Header";
import Button from "../../components/atoms/Button";
import Input from "../../components/atoms/Input";
import Select from "../../components/atoms/Select";
import Modal from "../../components/atoms/Modal";
import Pagination from '../../components/molecules/Pagination';
import MoneyInput from '../../components/atoms/MoneyInput';

import { getUserInformations, getComputersService } from "../../services/authServices";
import { getAllPaymentsByDate, searchPaymentByCnpjAdmin, enablePayment, updatePaymentStatus, getPayment, editPayment } from '../../services/paymentServices';
import { get4020Informations } from '../../services/reinfServices';
import { formatCpfOrCnpj } from '../../utils/formatCpfAndCnpj';
import convertCurrency from '../../utils/convertCurrency';

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
  const [useType, setUserType] = useState();
  const [modalData, setModalData] = useState();

  // Estado para Formulario no Modal ===
  const [companyId, setCompanyId] = useState();
  const [cnpj, setCnpj] = useState();
  const [value, setValue] = useState(`${modalData?.value}`);
  const [calculateBasis, setCalculateBasis] = useState(`${modalData?.calculation_basis}`);
  const [aliquot, setAliquot] = useState(`${modalData?.index}`);
  const [taxNote, setTaxNote] = useState(`${modalData?.tax_note}`);
  const [taxNoteSerie, setTaxNoteSerie] = useState(`${modalData?.tax_note_serie}`);
  const [computerSelected, setComputerSelected] = useState();
  const [computerOptions, setComputerOptions] = useState();
  const [paymentType, setPaymentType] = useState('');
  // ===================================
  // Estado para Formulario de pagamento associado no Modal ===
  const [paymentId, setPaymentId] = useState();
  const [paymentAssociateId, setPaymentAssociateId] = useState();
  const [valueAssociate, setValueAssociate] = useState(`${modalData?.['pre_payment_associate_id.value']}`);
  const [calculateBasisAssociate, setCalculateBasisAssociate] = useState(`${modalData?.['pre_payment_associate_id.calculation_basis']}`);
  const [aliquotAssociate, setAliquotAssociate] = useState(`${modalData?.['pre_payment_associate_id.index']}`);
  const [issItemCod, setIssItemCod] = useState('');
  const [irrfItemCod, setIrrfItemCode] = useState('');
  // ===================================
  // Informações sobre o fornecedor
  const [isService, setIsService] = useState();
  const [isProduct, setIsProduct] = useState();
  const [isSimple, setIsSimple] = useState();
  // ===================================.

  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Informações sobre o envio do reinf
  const [reinfData, setReinfData] = useState();
  // ===================================
  
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
      const response = await searchPaymentByCnpjAdmin({ cnpj: cnpjSearch });
      setRows(response.body);
      setCountPages(response.meta.pageCount);
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

  async function get4020Function(paymentId) {
    const responseToget4020Informations = await get4020Informations({ payment_id: paymentId });
    setReinfData(JSON.stringify(responseToget4020Informations.body));
  }

  async function openAndCloseModal(data) {
    try {
      if(isOpen == true) {
        await updatePaymentStatus({ status: status.label, payment_id: modalData.id }).then(response => {
          navigate(0);
        })
        setIsOpen(!isOpen);
      } else {
  
        setModalData(data);
        await get4020Function(data?.id);
  
        setStatus({ label: data?.status });
        setIsOpen(!isOpen);
      }
    } catch(error) {
      console.log(error);
    }
    
  }

  async function openAndCloseEditModal(data) {
    setIsEditOpen(!isEditOpen);
    setModalData(data);

    if(isEditOpen == false) {
      
      getPayment({ payment_id: data?.id }).then(async response => {

        let responseToGetComputers = await getComputersService({ city_id: response?.body?.city_id });
        setComputerOptions(responseToGetComputers.body);

        setPaymentId(data?.id);
        setCompanyId(response?.body?.id);
        setPaymentType(response?.body?.type);
        setCnpj(response?.body?.cnpj);
        setTaxNote(response?.body?.tax_note.split('-')[0]);
        setTaxNoteSerie(response?.body?.tax_note_serie);
        setComputerSelected({ label: response?.body?.['computer_id_payments.label'], value: response?.body?.['computer_id_payments.id'], cnpj: response?.body?.['computer_id_payments.cnpj']});
  
        setValue(response?.body?.value);
        setAliquot(response?.body?.index);
        setCalculateBasis(response?.body?.calculation_basis);
        setIssItemCod(response?.body?.iss_item?.split('–')[0]);
        setIrrfItemCode(response?.body?.['products_services_id_payments.code']);

        setPaymentAssociateId(response?.body?.payment_associate);

        setValueAssociate(response?.body?.['payment_associate_id.value']);
        setCalculateBasisAssociate(response?.body?.['payment_associate_id.calculation_basis']);
        setAliquotAssociate(response?.body?.['payment_associate_id.index']);
        
        setIsService(response?.body?.['company_id_payments.is_service']);
        setIsProduct(response?.body?.['company_id_payments.is_product']);
        setIsSimple(response?.body?.['company_id_payments.is_simple']);
      });
    }
  }

  function openDocumentInNewTab(link) {
    window.open(link, '_blank').focus()
  }

  async function auditPayment() {

    const objetctToAuditPayment = {
      payment_id: modalData.id,
      status: status.label
    };

    await enablePayment(objetctToAuditPayment).then(response => {

      toast({
        title: 'Pagamento Auditado com sucesso!',
        status: 'success',
        position: 'top-right',
        isClosable: true,
      });

      setIsOpen(false);
      navigate(0);

    }).catch(error => {
      toast({
        title: 'Houve um erro ao auditar esse pagamento!',
        status: 'error',
        position: 'top-right',
        isClosable: true,
      });
    });
  }

  async function handlerEditPayment () {

    const object = {
      payment_associate_id: paymentAssociateId,
      payment_id: paymentId,
      company_id: companyId,
      tax_note: taxNote,
      calculation_basis: parseFloat(convertCurrency(calculateBasis)),
      computer_id: computerSelected.value || computerSelected.id,
      index: parseFloat(aliquot),
      tax_note_serie: taxNoteSerie,
      value: parseFloat(convertCurrency(value)),
      calculation_basis_associate: parseFloat(convertCurrency(calculateBasisAssociate || '')),
      value_associate: parseFloat(convertCurrency(valueAssociate || '')),
      aliquot_associate: parseFloat(aliquotAssociate)
    }

    await editPayment(object).then(responseToEditPayment => {
      
      toast({
        title: 'Pagamento editado com sucesso!',
        status: 'success',
        position: 'top-right',
        isClosable: true,
      });

      navigate(0);

    }).catch(error => {
      toast({
        title: 'Houve um erro ao editar esse pagamento!',
        status: 'error',
        position: 'top-right',
        isClosable: true,
      });
    })
  }

  useEffect(() => {
    setRows([]);
    (async () => {
      await getUserInformations({ currentPage: currentPage }).then(response => {
        setUserName(response.body.user_name);
        setCityName(response.body.city_name);
        setUserType(sessionStorage.getItem('role'));
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
              <Button label={<AiOutlineSearch />} onPress={searchPayment} isLoading={rows?.length == 0 ? true : false} />
            </div>
          </div>
        </div>

        <div className={PaymentStyles.TableContainer}>

          <chakra.Skeleton className="w-full h-[60vh] mt-4" isLoaded={rows?.length > 0 ? true : false}>
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
                  <chakra.Th></chakra.Th>
                  <chakra.Th></chakra.Th>
                </chakra.Tr>
              </chakra.Thead>

              <chakra.Tbody>
                {rows?.map(rowsCalback => {
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
                      <chakra.Td>{rowsCalback?.['company_id_payments.label'] || rowsCalback?.company_name}</chakra.Td>
                      <chakra.Td>{formatCpfOrCnpj(rowsCalback.cnpj)}</chakra.Td>
                      <chakra.Td>{rowsCalback?.['city_id_payments.city_uf_id.label']}</chakra.Td>
                      <chakra.Td>{rowsCalback?.['city_id_payments.label']}</chakra.Td>
                      <chakra.Td>{rowsCalback.tax_note.split('-')[0]}</chakra.Td>
                      <chakra.Td><FiEye size={28} className='cursor-pointer' onClick={() => openAndCloseModal(rowsCalback)}/></chakra.Td>
                      {useType == 'ADMIN' ?  <chakra.Td><FiEdit size={28} className='cursor-pointer' onClick={() => openAndCloseEditModal(rowsCalback)}/></chakra.Td>: '' }
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
                    <chakra.Tab>REINF</chakra.Tab>
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
                                <span className='text-left'>{modalData?.['computer_id_payments.label']}</span>
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
                          
                          {
                            modalData?.type == 'simples' ?
                            <div className="flex w-[32vw] p-2 bg-[#F2F5FF] items-center justify-between rounded mt-2">
                              <span className="font-semibold">{ modalData?.['city_id_pre_payments.opt_law'] == true ? 'Optante Jurisprudência': 'Optante Legal'}</span>
                              <span>{'Sim'}</span>
                            </div>
                            :
                            <>
                            </>
                          }
                          

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
                            <div className='flex flex-col w-72 p-2 bg-[#F2F5FF] items-start rounded mr-2 text-left'>
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
                          <div className='flex mt-2'>
                            <div className='flex flex-col w-[30.5vw] p-2 bg-[#F2F5FF] items-start rounded mr-2 text-left'>
                              <span className='font-semibold'>Item ISS</span>
                              <span>{modalData?.['company_id_payments.iss_companies_id.iss_companies_iss_services_id.iss_services_products_services_id.label']}</span>
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

                          <div className='flex w-full mt-2'>
                            <div className='flex p-2 bg-[#ededed] rounded items-center justify-center mr-2'>
                              {modalData?.['company_id_payments.is_simei'] == true ? <AiOutlineCheckCircle size={20} color={'#18BA18'}/> : <AiOutlineCloseCircle size={20} color={'#BB0000'}/>}
                              <span className='font-semibold ml-2'>Simei</span>
                            </div>
                            <div className='flex p-2 bg-[#ededed] rounded items-center justify-center'>
                              {modalData?.['company_id_payments.non_incidence'] == true ? <AiOutlineCheckCircle size={20} color={'#18BA18'}/> : <AiOutlineCloseCircle size={20} color={'#BB0000'}/>}
                              <span className='font-semibold ml-2'>Não Incidente</span>
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

                    <chakra.TabPanel>

                      {
                        reinfData ?
                        <>
                          <div className='h-[54vh]'>
                            <div className='flex flex-col items-start'>
                              <span className='font-semibold text-lg'>Status</span>
                              <div className='flex'>
                                <div className='flex flex-col w-80 p-2 bg-[#F2F5FF] items-start rounded mr-2'>
                                  <span className='font-semibold'>Status Envio</span>
                                  <span>{JSON.parse(reinfData).status_envio.mensagem}</span>
                                </div>
                                <div className='flex flex-col w-80 p-2 bg-[#F2F5FF] items-start rounded'>
                                  <span className='font-semibold'>Status consulta</span>
                                  <span>{JSON.parse(reinfData).status_consulta.mensagem}</span>
                                </div>
                              </div>
                            </div>

                            <div className='flex flex-col items-start mt-4'>
                              <span className='font-semibold text-lg'>Informações Entrega</span>
                              <div className='flex'>
                                <div className='flex flex-col w-80 p-2 bg-[#F2F5FF] items-start rounded mr-2'>
                                  <span className='font-semibold'>Recibo</span>
                                  <span>{JSON.parse(reinfData).json_retorno[0]?.recibo}</span>
                                </div>
                                <div className='flex flex-col w-80 p-2 bg-[#F2F5FF] items-start rounded'>
                                  <span className='font-semibold'>Protocolo</span>
                                  <span>{JSON.parse(reinfData).json_retorno[0]?.protocoloEntrega}</span>
                                </div>
                              </div>
                            </div>

                            <div className='flex flex-col items-start mt-4'>
                              <span className='font-semibold text-lg'>Valores processados</span>
                              <div className='flex'>
                                <div className='flex flex-col w-56 p-2 bg-[#F2F5FF] items-start rounded mr-2'>
                                  <span className='font-semibold'>Valo Base</span>
                                  <span>{fromCurrency.format(JSON.parse(reinfData).json_retorno[0].R9005?.totApurMen[0]?.vlrBaseCRMen.replace(',', '.'))}</span>
                                </div>
                                <div className='flex flex-col w-44 p-2 bg-[#F2F5FF] items-start rounded mr-2'>
                                  <span className='font-semibold'>Valor IRRF</span>
                                  <span>{fromCurrency.format(JSON.parse(reinfData).json_retorno[0].R9005?.totApurMen[0]?.totApurTribMen[0].vlrCRMenInf.replace(',', '.'))}</span>
                                </div>
                                <div className='flex flex-col w-56 p-2 bg-[#F2F5FF] items-start rounded'>
                                  <span className='font-semibold'>Natureza do rendimento</span>
                                  <span>{JSON.parse(reinfData).json_retorno[0].R9005?.totApurMen[0]?.natRend}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                        :
                        <>
                          <div className='h-[54vh]'>
                            <div>
                              <div className="w-64 mt-8 mb-8">
                                <Player
                                  src='https://assets8.lottiefiles.com/private_files/lf30_fn9xcfqg.json'
                                  className="player"
                                  loop
                                  autoplay
                                />
                              </div>
                              <span>Pagamento ainda não enviado para a receita ou não encontrado</span>
                            </div>
                          </div>
                        </>
                      }
                      
                    </chakra.TabPanel>

                  </chakra.TabPanels>
                </chakra.Tabs>
              </div>
            </div>
          </Modal>
          
          <Modal isCentered size={'xl'} title={'Editar Pagamento'} isOpen={isEditOpen} modalOpenAndClose={openAndCloseEditModal}>
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
                <form className='h-auto'>
                  <div className={PaymentStyles.RowContainer}>
                    <div className='w-96'>
                      <Select placeholder={'Ordenador de despesa'}
                        selectedValue={computerSelected}
                        setSelectedValue={(item) => setComputerSelected(item)}
                        options={computerOptions}
                      />
                    </div>
                    <div className='w-60 ml-4'>
                      <Input label='CNPJ Ordenador' placeholder='CNPJ Ordenador' value={computerSelected?.cnpj} />
                    </div>
                  </div>
                  
                  <div className={PaymentStyles.RowContainer}>
                    <div className='w-60 mr-4'>
                      <Input label='CNPJ Fornecedor' placeholder='CNPJ' value={cnpj} onChange={e => setCnpj(e.target.value)} />
                    </div>

                    <div className='w-40'>
                      <Input label='Nota fiscal' placeholder='Nota fiscal' value={taxNote} onChange={e => setTaxNote(e.target.value)}  />
                    </div>

                    <div className='w-52 ml-4'>
                      <Input label='Serie' placeholder='Serie' value={taxNoteSerie} onChange={e => setTaxNoteSerie(e.target.value)}/>
                    </div>
                  </div>
                      
                  <div className={PaymentStyles.RowContainer}>
                    <div>
                      <span className='mb-2 font-semibold'>{modalData?.type == 'simples' ? 'ISS' : 'IRRF'}</span>
                      <div className='flex p-2 w-auto border border-[#999] rounded-lg'>
                        <div className='w-44 mr-4'>
                          <MoneyInput label='Crédito / Pagamento' placeholder='Crédito de pagamento' value={value} onChange={e => setValue(e.target.value)} />
                        </div>

                        <div className='w-44 mr-4'>
                          <MoneyInput label='Base de Cálculo' placeholder='Base de cálculo' value={calculateBasis} onChange={e => setCalculateBasis(e.target.value)} />
                        </div>

                        <div className='w-24 mr-4'>
                          <Input label={paymentType == 'simples' ? 'Item' : 'Código'} placeholder='' value={paymentType == 'simples' ? issItemCod : irrfItemCod} />
                        </div>

                        <div className='w-36'>
                          <Input label='Aliquota' placeholder='Aliquota' value={aliquot} onChange={e => setAliquot(e.target.value)}/>
                        </div>
                      </div>
                    </div>
                  </div>

                  { paymentAssociateId == null ?
                    <></>
                    :
                    <>
                      <div className={PaymentStyles.RowContainer}>
                        <div>
                          <span className='mb-2 font-semibold'>{paymentType == 'simples' ? 'IRRF' : 'ISS'}</span>
                          <div className='flex p-2 w-auto border border-[#999] rounded-lg'>
                            <div className='w-44 mr-4'>
                              <MoneyInput label='Crédito / Pagamento' placeholder='Crédito de pagamento' value={valueAssociate} onChange={e => setValueAssociate(e.target.value)} />
                            </div>

                            <div className='w-44 mr-4'>
                              <MoneyInput label='Base de Cálculo' placeholder='Base de cálculo' value={calculateBasisAssociate} onChange={e => setCalculateBasisAssociate(e.target.value)} />
                            </div>

                            <div className='w-24 mr-4'>
                              <Input label={paymentType == 'simples' ? 'Item' : 'Código'} placeholder='' value={paymentType == 'simples' ? irrfItemCod : issItemCod } />
                            </div>

                            <div className='w-36'>
                              <Input label='Aliquota' placeholder='Aliquota' value={aliquotAssociate} onChange={e => setAliquotAssociate(e.target.value)}/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  }
                      
                  <div className='flex flex-col w-full h-auto mt-2'>
                    <span className='text-2xl font-semibold'>Informações do Fornecedor</span>
                    <div className='w-full h-auto'>
                      <span className='font-semibold'>Objeto do contrato: </span>
                      <span>{modalData?.['company_id_pre_payments.object']}</span>
                    </div>
                    <div className='flex w-full mt-2'>
                      <div className='flex p-2 bg-[#ededed] rounded items-center justify-center mr-2'>
                        {isSimple == true ? <AiOutlineCheckCircle size={20} color={'#18BA18'}/> : <AiOutlineCloseCircle size={20} color={'#BB0000'}/>}
                        <span className='font-semibold ml-2'>Simples</span>
                      </div>
                      <div className='flex p-2 bg-[#ededed] rounded items-center justify-center mr-2'>
                        {isService == true ? <AiOutlineCheckCircle size={20} color={'#18BA18'}/> : <AiOutlineCloseCircle size={20} color={'#BB0000'}/>}
                        <span className='font-semibold ml-2'>Fornece Serviços</span>
                      </div>
                      <div className='flex p-2 bg-[#ededed] rounded items-center justify-center'>
                        {isProduct == true ? <AiOutlineCheckCircle size={20} color={'#18BA18'}/> : <AiOutlineCloseCircle size={20} color={'#BB0000'}/>}
                        <span className='font-semibold ml-2'>Fornece Produtos</span>
                      </div>
                    </div>
                  </div>
                </form>

                <div className='flex justify-end mt-8 h-auto'>
                  <div className='w-56'>
                    <Button label='Salvar' type='Primary' onPress={handlerEditPayment}/>
                  </div>
                </div>
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