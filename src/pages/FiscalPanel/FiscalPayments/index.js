import { useEffect, useState, useMemo } from 'react';
import {
  BrowserRouter as Router,
  useLocation,
  useNavigate 
} from "react-router-dom";
import moment from 'moment/moment';
import * as chakra from '@chakra-ui/react';
import Zoom from 'react-medium-image-zoom'

import { AiOutlineSearch, AiOutlineCloseCircle, AiOutlineCheckCircle } from "react-icons/ai";
import { MdLocationCity } from "react-icons/md";
import { FiEye, FiX } from "react-icons/fi";
import { TbEdit } from "react-icons/tb";

import { Player } from '@lottiefiles/react-lottie-player';

import Header from '../../../components/molecules/Header';
import Button from "../../../components/atoms/Button";
import Input from "../../../components/atoms/Input";
import Pagination from "../../../components/molecules/Pagination";
import Modal from "../../../components/atoms/Modal";

import { formatCpfOrCnpj } from '../../../utils/formatCpfAndCnpj';

import { getUserInformations } from "../../../services/authServices";
import { getAllCitiesRegisted } from "../../../services/adminServices";
import { getAllPaymentsByDate, searchPaymentByCnpj, getAllPaymentsByCityAndDate } from "../../../services/paymentServices";
import { get4020Informations } from '../../../services/reinfServices';

import { FiscalPaymentsStyle } from './style';

const FiscalPayments = () => {
  const [userName, setUserName] = useState('');
  const [cityName, setCityName] = useState('');
  const [cnpjSearch, setCnpjSearch] = useState('');
  const [taxNoteSearch, setTaxNoteSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState();

  const [countPages, setCountPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const atualDay = moment().toDate().getUTCDate();
  const [initialDate, setInitialDate] = useState(moment().subtract(atualDay, 'days').format('yyyy/MM/DD'));
  const [finalDate, setFinalDate] = useState(moment().add(1, 'days').format('yyyy/MM/DD'));
  const [grossValue, setGrossValue] = useState('');
  const [netOfTaxValue, setNetOfTaxValue] = useState('');

  const [exportInitialDate, setExportInitialDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');

  const [citySearch, setCitySearch] = useState('');
  const imagem = modalData?.tax_note_link;
  const [modalExport, setModalExport] = useState(false);

  // Informações sobre o envio do reinf
  const [reinfData, setReinfData] = useState();

  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const query = useQuery();
  const toast = chakra.useToast();
  const fromCurrency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

  function useQuery() {
    const { search } = useLocation();
  
    return useMemo(() => new URLSearchParams(search), [search]);
  }

  async function searchPayment () {
    setRows([]);
    if(cnpjSearch == '') {
      setCurrentPage(1);
      await initialSearch(citySearch);
    } else {
      const response = await searchPaymentByCnpj({ cnpj: cnpjSearch, city_id: citySearch, tax_note: taxNoteSearch });
      setRows(response.body.rows);
      setCountPages(response.body.meta.pageCount);
      setIsLoading(false);
    }
  }

  async function openAndCloseModal(data) {
    // if(isOpen == false) {
    //   await get4020Function(data?.id);
    // }

    setModalData(data);
    setIsOpen(!isOpen);
  }

  async function initialSearch (city_id) {
    await getAllPaymentsByCityAndDate({
      initial_date: initialDate == undefined ? moment().subtract(atualDay, 'days').format('yyyy/MM/DD') : initialDate,
      final_date: finalDate == undefined ? moment().format('yyyy/MM/DD') : finalDate,
      city_id: city_id,
      pageCount: currentPage
    }).then(response => {
      setCityName(response.city.label);
      setRows(response.rows);
      setIsLoading(false);
      setCountPages(response.meta.pageCount);
    });
  };

  async function get4020Function(paymentId) {
    const responseToget4020Informations = await get4020Informations({ payment_id: paymentId });
    setReinfData(JSON.stringify(responseToget4020Informations.body));
  }

  function generateComprovanteReinf () {
    sessionStorage.setItem('payment_id', modalData?.id);
    navigate('/reinf-comprovante');
  }

  useEffect(() => {
    (async () => {
      await getUserInformations({ currentPage: 1 }).then(async response => {
        setCitySearch(response.body.city_id);
        setUserName(response.body.user_name);
        await initialSearch(response.body.city_id);
      });
      
    })()
  }, [currentPage]);

  useEffect(() => {

    (async () => {
      await getUserInformations({ currentPage: 1 }).then(response => {
        setCitySearch(response.body.city_id);
        setUserName(response.body.user_name);
      });
    })();

  }, []);

  return (
    <section className={FiscalPaymentsStyle.Container}>
      <Header userName={userName} cityName={cityName} />
      <div className={FiscalPaymentsStyle.BodyContainer}>
        <div className={FiscalPaymentsStyle.TitleContainer}>
          <div className='flex w-full justify-between'>
            <h1 className='text-3xl font-semibold'>Pagamentos</h1>
            <h2 className='text-2xl font-medium text-[#2F4ECC]'>{cityName}</h2>
          </div>
            
          <div className='w-auto flex justify-between items-end mt-2'>
            <div className='flex items-end'>
            <div className='w-56 mr-4'>
                <Input label='Nota fiscal' placeholder='Nota Fiscal' value={taxNoteSearch} onChange={e => setTaxNoteSearch(e.target.value)} />
              </div>
              <div className='w-72 mr-4'>
                <Input label='Pesquisar' placeholder='Pesquisar pagamento' value={cnpjSearch} onChange={e => setCnpjSearch(e.target.value)} />
              </div>
              <div className={FiscalPaymentsStyle.TitleButtonContainer}>
                <Button label={<AiOutlineSearch />} onPress={() => searchPayment()} isLoading={isLoading} />
              </div>
            </div>
          </div>

        </div>

        <div className='w-full border border-[#ededed] rounded mt-6 overflow-x-scroll'>
          <chakra.Skeleton className="w-full h-[60vh] mt-4" isLoaded={rows.length > 0 ? true : false}>
            <chakra.Table variant='simple' size='lg'>
              <chakra.Thead>
                <chakra.Tr>
                  <chakra.Th></chakra.Th>
                  <chakra.Th>Nota fiscal</chakra.Th>
                  <chakra.Th>Lançamento</chakra.Th>
                  <chakra.Th>Nome da Empresa</chakra.Th>
                  <chakra.Th>CNPJ</chakra.Th>
                  <chakra.Th>Status</chakra.Th>
                  <chakra.Th></chakra.Th>
                </chakra.Tr>
              </chakra.Thead>

              <chakra.Tbody>
                {rows.map(rowsCallback => {
                  let rowBgColor;
                  let bgIndicator;

                  switch (rowsCallback.reinf_r4020_payload !== null) {
                    case false:
                      rowBgColor = 'bg-[#F5F5FA]';
                      bgIndicator = 'w-[10px] h-[40px] rounded bg-[#2F4ECC]'
                      break
                    case true:
                      rowBgColor = 'bg-[#EEFFF4]';
                      bgIndicator = 'w-[10px] h-[40px] rounded bg-[#18BA18]'
                      break
                  }

                  return (
                    <chakra.Tr className={rowBgColor}>
                      <chakra.Td><div className={bgIndicator}></div></chakra.Td>
                      <chakra.Td>{rowsCallback.tax_note.split('-')[0]}</chakra.Td>
                      <chakra.Td>{moment(rowsCallback.createdAt).format('DD/MM/YYYY')}</chakra.Td>
                      <chakra.Td>{rowsCallback.company_name}</chakra.Td>
                      <chakra.Td>{formatCpfOrCnpj(rowsCallback.cnpj)}</chakra.Td>
                      <chakra.Td>{<chakra.Switch className='mr-4' size='md' isChecked={rowsCallback.transferred} />}</chakra.Td>
                      <chakra.Td><FiEye size={28} className='cursor-pointer' onClick={() => openAndCloseModal(rowsCallback)}/></chakra.Td>
                    </chakra.Tr>
                  )
                })}
              </chakra.Tbody>
            </chakra.Table>
          </chakra.Skeleton>
        </div>

        <Modal isCentered size={'xl'} title={'Pagamento'} isOpen={isOpen} modalOpenAndClose={openAndCloseModal}>
            <div className={FiscalPaymentsStyle.ModalBodyContainer}>
              <div className={FiscalPaymentsStyle.ContentModalContainer}>
                <chakra.Tabs align='center' isFitted variant='enclosed'>
                  <chakra.TabList>
                    <chakra.Tab>Pagamento</chakra.Tab>
                    <chakra.Tab>Fornecedor</chakra.Tab>
                    <chakra.Tab>REINF</chakra.Tab>
                  </chakra.TabList>

                  <chakra.TabPanels>
                    <chakra.TabPanel>
                      <div className='w-[100%]'>
                        <div className='flex flex-col items-start'>
                          <span className='font-semibold text-lg'>Dados da nota fiscal</span>
                          <div className='w-full flex justify-between'>
                            <div className='flex flex-col w-96 p-2 bg-[#F2F5FF] items-start rounded'>
                              <span className='font-semibold'>Número da Nota fiscal</span>
                              <span>{modalData?.tax_note.split('-')[0]}</span>
                            </div>
                            <div className='flex flex-col w-96 p-2 bg-[#F2F5FF] items-start rounded'>
                              <span className='font-semibold'>Número de série Nota Fiscal</span>
                              <span>{modalData?.tax_note_serie}</span>
                            </div>
                          </div>
                        </div>

                        <div className='flex w-full justify-between mt-2'>
                          <div className='flex flex-col items-start justify-start mr-2'>
                            <span className='font-semibold text-lg'>Dados do pagador</span>
                            <div className='flex flex-col'>
                              <div className='flex flex-col w-96 p-2 bg-[#F2F5FF] items-start rounded mb-2'>
                                <span className='font-semibold'>Município</span>
                                <span>{modalData?.['city_id_payments.label'] || modalData?.city_id_payments.label }</span>
                              </div>
                              <div className='flex flex-col w-96 p-2 bg-[#F2F5FF] items-start rounded mb-2'>
                                <span className='font-semibold'>CNPJ</span>
                                <span>{modalData?.['computer_id_payments.cnpj'] || modalData?.city_id_payments.cnpj}</span>
                              </div>
                              <div className='flex flex-col w-96 p-2 bg-[#F2F5FF] items-start rounded'>
                                <span className='font-semibold'>Ordenador de despesa</span>
                                <span className='text-left'>{modalData?.['computer_id_payments.label'] || modalData?.computer_id_payments.label}</span>
                              </div>
                            </div>
                          </div>
                          <div className='flex flex-col items-start justify-start'>
                            <span className='font-semibold text-lg'>Dados do Fornecedor</span>
                            <div className='flex flex-col'>
                              <div className='flex flex-col w-96 p-2 bg-[#F2F5FF] items-start rounded mb-2 text-left'>
                                <span className='font-semibold'>Nome/Razão social</span>
                                <span>{modalData?.['company_id_payments.label'] || modalData?.company_id_payments.label}</span>
                              </div>
                              <div className='flex flex-col w-96 p-2 bg-[#F2F5FF] items-start rounded mb-2'>
                                <span className='font-semibold'>CNPJ</span>
                                <span>{formatCpfOrCnpj(modalData?.cnpj)}</span>
                              </div>
                              <div className='flex flex-col w-96 p-2 bg-[#F2F5FF] items-start rounded'>
                                <span className='font-semibold'>Competência</span>
                                <span>{moment(modalData?.createdAt).format('MMMM [de] YYYY')}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col w-full mt-4 items-start">
                          <span className="font-semibold text-lg">Memória de Cálculo</span>
                          <div className="flex w-[100%] p-2 bg-[#F2F5FF] items-center justify-between rounded ">
                            <span className="font-semibold">Crédito / Pagamento</span>
                            <span>{fromCurrency.format(modalData?.value)}</span>
                          </div>
                          <div className="flex w-[100%] p-2 bg-[#F2F5FF] items-center justify-between rounded mt-2">
                            <span className="font-semibold">Base de Cálculo da Retenção</span>
                            <span>{fromCurrency.format(modalData?.calculation_basis)}</span>
                          </div>

                          <div className="flex w-[100%] p-2 bg-[#F2F5FF] items-center justify-between rounded mt-2">
                            <span className="font-semibold">{modalData?.type == 'simples' ? 'Aliquota do Imposto Sobre Serviço Retido na Fonte' : 'Alíquota do Imposto de Renda Retido na Fonte'}</span>
                            <span>{modalData?.index} %</span>
                          </div>

                          <div className="flex w-[100%] p-2 bg-[#F2F5FF] items-center justify-between rounded mt-2">
                            <span className="font-semibold">{ modalData?.type == 'simples' ? 'Valor do ISS Retido na fonte': 'Valor do IR Retido na Fonte'}</span>
                            <span>{fromCurrency.format(modalData?.withheld_tax)}</span>
                          </div>

                          <div className="flex w-[100%] p-2 bg-[#F2F5FF] items-center justify-between rounded mt-2">
                            <span className="font-semibold">Valor do Saldo de Pagamento</span>
                            <span>{fromCurrency.format(modalData?.net_of_tax)}</span>
                          </div>

                        </div>
                      </div>
                    </chakra.TabPanel>
                    
                    <chakra.TabPanel>
                      <div className='w-[100%] h-[54vh]'>
                        <div className='flex flex-col items-start'>
                          <span className='font-semibold text-lg'>Dados do Fornecedor</span>
                          <div className='flex'>
                            <div className='flex flex-col w-96 p-2 bg-[#F2F5FF] items-start rounded mr-2'>
                              <span className='font-semibold'>Nome</span>
                              <span>{modalData?.['company_id_payments.label'] || modalData?.company_id_payments.label}</span>
                            </div>
                            <div className='flex flex-col w-96 p-2 bg-[#F2F5FF] items-start rounded'>
                              <span className='font-semibold'>CNPJ</span>
                              <span>{formatCpfOrCnpj(modalData?.['company_id_payments.cnpj'] || modalData?.company_id_payments.cnpj)}</span>
                            </div>
                          </div>
                          <div className='flex mt-2'>
                            <div className='flex flex-col w-[40.5vw] p-2 bg-[#F2F5FF] items-start rounded mr-2'>
                              <span className='font-semibold'>Objeto do contrato</span>
                              <span>{modalData?.['company_id_payments.object'] || modalData?.company_id_payments.object}</span>
                            </div>
                          </div>
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
                                  <span>{fromCurrency.format(JSON.parse(reinfData).json_retorno[0].R9005.totApurMen[0].vlrBaseCRMen.replace(',', '.'))}</span>
                                </div>
                                <div className='flex flex-col w-44 p-2 bg-[#F2F5FF] items-start rounded mr-2'>
                                  <span className='font-semibold'>Valor IRRF</span>
                                  <span>{fromCurrency.format(JSON.parse(reinfData).json_retorno[0].R9005.totApurMen[0].totApurTribMen[0].vlrCRMenInf.replace(',', '.'))}</span>
                                </div>
                                <div className='flex flex-col w-56 p-2 bg-[#F2F5FF] items-start rounded'>
                                  <span className='font-semibold'>Natureza do rendimento</span>
                                  <span>{JSON.parse(reinfData).json_retorno[0].R9005.totApurMen[0].natRend}</span>
                                </div>
                              </div>
                            </div>

                            <div className='flex flex-col mt-4'>
                              <div className='w-72'>
                                <Button  label='Baixar Comprovante de envio' onPress={() => generateComprovanteReinf() } />
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

        <Modal isCentered size={'md'} title={'Exportar Pagamentos'} isOpen={modalExport} modalOpenAndClose={() => setModalExport(!modalExport)}>
          <div className='flex flex-col w-full h-auto'>
            <div className='flex w-full gap-4'>
              <div className='w-full'>
                <Input label={'De'} placeholder={'DD/MM/YYYY'} value={exportInitialDate} onChange={(e) => setExportInitialDate(e.target.value)} />
              </div>
              <div className='w-full'>
                <Input label={'Até'} placeholder={'DD/MM/YYYY'} value={exportEndDate} onChange={(e) => setExportEndDate(e.target.value)} />
              </div>
            </div>

            <div className='w-full mt-6'>
              <div>
                <Button label='Exportar' />
              </div>
            </div>
          </div>
        </Modal>

        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pages={countPages} />

      </div>
    </section>
  )
}

export default FiscalPayments;