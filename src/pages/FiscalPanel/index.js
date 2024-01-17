import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import * as chakra from '@chakra-ui/react';
import { FiEye, FiDownload } from 'react-icons/fi';
import { AiOutlineSearch } from "react-icons/ai";
import moment from 'moment/moment';
import 'moment/locale/pt-br';
import { Player } from '@lottiefiles/react-lottie-player';

import Header from '../../components/molecules/Header';
import Input from '../../components/atoms/Input';
import Button from '../../components/atoms/Button';
import Modal from '../../components/atoms/Modal';
import Pagination from '../../components/molecules/Pagination';

import { formatCpfOrCnpj } from '../../utils/formatCpfAndCnpj'

import { getUserInformations } from '../../services/authServices';
import { getSecretaryPayments, confirmPaymentService } from '../../services/paymentServices';

import { FiscalPanelStyle } from './style';

const FiscalPanel = () => {
  const [paymentsData, setPaymentsData] = useState([]);
  const [userName, setUserName] = useState('');
  const [cityName, setCityName] = useState('');
  const [initDate, setInitDate] = useState(moment().subtract(30, 'days').format('DD/MM/YYYY'));
  const [endDate, setEndDate] = useState(moment().format('DD/MM/YYYY'));
  const [cnpj, setCnpj] = useState('');
  const [password, setPassword] = useState('');
  const [efetiveDate, setEfetiveDate] = useState(moment().format('DD/MM/YYYY'));

  const [modalData, setModalData] = useState();
  const [isOpen, setIsOpen] = useState();

  const [currentPage, setCurrentPage] = useState(1);
  const [countPages, setCountPages] = useState(1);

  const [isLoading, setIsLoading] = useState(false);

  moment.locale('pt-br');
  const fromCurrency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
  const navigate = useNavigate();
  const toast = chakra.useToast();
  
  function openAndCloseModal () {
    setIsOpen(!isOpen);
  }

  function generateDocument (item) {
    sessionStorage.setItem('payment_id', item);
    navigate('/extrato-fiscal');
  }

  function processPaymentData (paymentData) {

    const paymentsArray = [];
    const setIdBanned = new Set();

    paymentData.map(paymentDataCallback => {

      if(paymentDataCallback?.payment_associate == null) {
        paymentsArray.push(paymentDataCallback);
        return
      } else {

        if(setIdBanned.has(paymentDataCallback.id)) {
          return
        } else {
          setIdBanned.add(paymentDataCallback.payment_associate);
          paymentsArray.push(paymentDataCallback)
        }
      }
    })

    setPaymentsData(paymentsArray);
  }

  useEffect(() => {
    (async () => await getUserInformations({ currentPage: 1 }).then(response => {
      setUserName(response.body.user_name);
      setCityName(response.body.city_name);
    }))()
  }, []);

  useEffect(() => {
    setIsLoading(false);

    (async () => await getSecretaryPayments(
      {
        initDate: moment(initDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        endDate: moment(endDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        currentPage: currentPage <= 0 ? 1 : currentPage,
        cnpj: cnpj
      }
    ).then(response => {
      processPaymentData(response.rows)
      setCountPages(response.meta.pageCount);
      
    }))()
    setIsLoading(true);
  }, [currentPage]);

  const getPayments = async () => {
    setCurrentPage(currentPage - 1);
  }

  const confirmPayment = async () => {

    if(password == '') {
      toast({
        title: 'Digite sua senha de acesso!',
        status: 'error',
        position: 'top-right',
        isClosable: true,
      });
    } else {
      await confirmPaymentService({ payment_id: modalData.id, phrase: password, date: efetiveDate }).then(async response => {

        toast({
          title: 'Pagamento Confirmado!',
          status: 'success',
          position: 'top-right',
          isClosable: true,
        });

        setIsOpen(false);
        await getPayments();

      }).catch(error => {
        if(error == 412) {
          toast({
            title: 'A senha informada está incorreta!',
            status: 'error',
            position: 'top-right',
            isClosable: true,
          });
        } else  if(error == 403) {
          toast({
            title: 'O ordenador não está habilitado a informar pagamentos',
            status: 'error',
            position: 'top-right',
            isClosable: true,
          });
        } 
        else {
          toast({
            title: 'Houve um problema na confirmação desse pagamento!',
            status: 'error',
            position: 'top-right',
            isClosable: true,
          });
        }
        console.log(error);
      });
    }
    
  }

  return (
    <section className={FiscalPanelStyle.Container}>
      <Header userName={userName} cityName={cityName} />
      <div className={FiscalPanelStyle.BodyContainer}>
        <div className={FiscalPanelStyle.TitleContainer}>
          <h1>Central de Retenção</h1>
        </div>
        <div className='flex w-full mt-4 mb-4 items-end'>
          <div className='w-56 mr-6'>
            <Input label='Data Inicial' placeholder='DD/MM/YYYY' value={initDate} onChange={(e) => setInitDate(e.target.value)} />
          </div>
          <div className='w-56 mr-6'>
            <Input label='Data Final' placeholder='DD/MM/YYYY' value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className='w-56 mr-6'>
            <Input label='CNPJ' placeholder='CNPJ' value={cnpj} onChange={(e) => setCnpj(e.target.value)} />
          </div>
          <div>
            <Button label={  <AiOutlineSearch />} onPress={() => getPayments()} />
          </div>
        </div> 
        
        <Modal isCentered size={'xl'} title={modalData?.company_name} isOpen={isOpen} modalOpenAndClose={openAndCloseModal}>
          <>
            <div className='h-auto'>
              <div className='flex justify-between'>
                <div className='w-96 h-full'>
                  <span className='text-xl'>Dados do Pagador</span>

                  <div className='flex flex-col w-full h-auto rounded bg-[#F2F5FF] p-2 mt-2'>
                    <span className='font-semibold'>Município</span>
                    <span>{`Prefeitura Municipal de ${modalData?.['computer_id_payments.computer_city_id.label']} - ${modalData?.['computer_id_payments.computer_city_id.city_uf_id.label']}`}</span>
                  </div>

                  <div className='flex flex-col w-full h-auto rounded bg-[#F2F5FF] p-2 mt-2'>
                    <span className='font-semibold'>CNPJ do Ordenador</span>
                    <span>{modalData?.['computer_id_payments.cnpj']}</span>
                  </div>

                  <div className='flex flex-col w-full h-auto rounded bg-[#F2F5FF] p-2 mt-2'>
                    <span className='font-semibold'>Ordenador de despesa</span>
                    <span>{modalData?.['computer_id_payments.label']}</span>
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
                    <span>{formatCpfOrCnpj(modalData?.cnpj)}</span>
                  </div>

                  <div className='flex flex-col w-full h-auto rounded bg-[#F2F5FF] p-2 mt-2'>
                    <span className='font-semibold'>Competência</span>
                    <span>{moment(modalData?.createdAt).format('LL') }</span>
                  </div>
                </div>
              </div>

              <div className='flex flex-col h-64 mt-4'>
                <span className='text-xl'>Memória de cálculo da retenção</span>
                <span className='font-semibold'>{modalData?.type == 'ordinario' ? 'Imposto de Renda Retido na fonte': 'Imposto sobre Serviço Retido na fonte'}</span>
                <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                  <span className='font-semibold'>Valor da nota</span>
                  <span>{fromCurrency.format(modalData?.value)}</span>
                </div>
              </div>

              <div className='flex w-full justify-end items-end pb-6 gap-x-4'>

                <div className='w-96'>
                  <Input label='Digite a data do efetivo pagamento' placeholder='2024/01/01'  value={efetiveDate} onChange={(e) => setEfetiveDate(e.target.value)} />
                </div>
                <div className='w-96'>
                  <Input label='Digite sua senha' placeholder='Senha' type={'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>
              <div className='flex w-full justify-end pb-6'>
                <div className='w-96 mr-4'>
                  <Button label='Cancelar' type="second" onPress={() => setIsOpen(!isOpen)}  />
                </div>
                <div className='w-96'>
                  <Button label='Confirmar Pagamento' onPress={() => confirmPayment()} />
                </div>
              </div>

            </div>
          </>
        </Modal>

        {
          paymentsData.length > 0 ? 
          <div className={FiscalPanelStyle.TableContainer}>
            <chakra.Skeleton className="w-full h-auto" isLoaded={isLoading}>
              <chakra.TableContainer>
                <chakra.Table variant='simple' size='lg' >
                  <chakra.Thead>
                    <chakra.Tr>
                      <chakra.Th></chakra.Th>
                      <chakra.Th>Nota fiscal</chakra.Th>
                      <chakra.Th>Data</chakra.Th>
                      <chakra.Th>Empresa</chakra.Th>
                      <chakra.Th>Ordenador</chakra.Th>
                      <chakra.Th></chakra.Th>
                      <chakra.Th></chakra.Th>
                    </chakra.Tr>
                  </chakra.Thead>
                  <chakra.Tbody>
                    {paymentsData.map(paymentsDataCallback => {
                      let rowBgColor;
                      let bgIndicator;
    
                      switch (paymentsDataCallback?.['payment_associate_id.reinf_r4020_payload'] == null) {
                        case false:
                          rowBgColor = 'bg-[#EEFFF4]';
                          bgIndicator = 'w-[10px] h-[40px] rounded bg-[#18BA18]'
                          break
                        case true:
                          rowBgColor = 'bg-[#F5F5FA]';
                          bgIndicator = 'w-[10px] h-[40px] rounded bg-[#2F4ECC]'
                          break
                      }
                      return (
                        <>
                          <chakra.Tr className={rowBgColor}>
                            <chakra.Td><div className={bgIndicator}></div></chakra.Td>
                            <chakra.Td>{paymentsDataCallback.tax_note.split('-')[0]}</chakra.Td>
                            <chakra.Td>{moment(paymentsDataCallback.createdAt).format('DD/MM/YYYY')}</chakra.Td>
                            <chakra.Td>{paymentsDataCallback.company_name}</chakra.Td>
                            <chakra.Td>{paymentsDataCallback?.['computer_id_payments.label']}</chakra.Td>
                            <chakra.Td><FiEye size={28} className='cursor-pointer' onClick={() => {openAndCloseModal(); setModalData(paymentsDataCallback)}}/></chakra.Td>
                            <chakra.Td><FiDownload size={28} className='cursor-pointer' onClick={() => {generateDocument(paymentsDataCallback.id)}}/></chakra.Td>
                            
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

    </section>
  );
}

export default FiscalPanel;