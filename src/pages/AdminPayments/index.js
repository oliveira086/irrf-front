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

import Header from '../../components/molecules/Header';
import Button from "../../components/atoms/Button";
import Input from "../../components/atoms/Input";
import Pagination from "../../components/molecules/Pagination";
import Modal from "../../components/atoms/Modal";

import { formatCpfOrCnpj } from '../../utils/formatCpfAndCnpj';

import { getUserInformations } from "../../services/authServices";
import { getAllCitiesRegisted } from "../../services/adminServices";
import { getGrossBalanceByCityAndDate, getAllPaymentsByDate, searchPaymentByCnpj, getAllPaymentsByCityAndDate } from "../../services/paymentServices";

import { AdminPaymentSyle } from './style';

const AdminPayment = () => {
  const [userName, setUserName] = useState('');
  const [cityName, setCityName] = useState('');
  const [cnpjSearch, setCnpjSearch] = useState('');
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
      await initialSearch();
    } else {
      const response = await searchPaymentByCnpj({ cnpj: cnpjSearch });
      setRows(response.body);
      setCountPages(response.meta.pageCount);
      setIsLoading(false);
    }
  }

  async function openAndCloseModal(data) {
    setModalData(data);
    setIsOpen(!isOpen);
  }

  useEffect(() => {

    (async () => {
      await getUserInformations({ currentPage: 1 }).then(response => {
        setUserName(response.body.user_name);
      });

      await getGrossBalanceByCityAndDate({
        initial_date: initialDate == undefined ? moment().subtract(atualDay, 'days').format('yyyy/MM/DD') : initialDate,
        final_date: finalDate == undefined ? moment().format('yyyy/MM/DD') : finalDate,
        city_id: query.get("cityId")
      }).then(response => {
        setGrossValue(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(response.body.totalValue));
        setNetOfTaxValue(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(response.body.totalWithheldTaxSum));
      });
    })();

  }, []);

  async function initialSearch () {
    await getAllPaymentsByCityAndDate({
      initial_date: initialDate == undefined ? moment().subtract(atualDay, 'days').format('yyyy/MM/DD') : initialDate,
      final_date: finalDate == undefined ? moment().format('yyyy/MM/DD') : finalDate,
      city_id: query.get("cityId"),
      pageCount: currentPage
    }).then(response => {
      setCityName(response.city.label);
      setRows(response.rows);
      setIsLoading(false);
      setCountPages(response.meta.pageCount);
    });
  };

  useEffect(() => {
    (async () => {
      await initialSearch();
    })()
  }, [currentPage]);

  return (
    <section className={AdminPaymentSyle.Container}>
      <Header userName={userName} cityName={cityName} />
      <div className={AdminPaymentSyle.BodyContainer}>
        <div className={AdminPaymentSyle.TitleContainer}>
          <div className='flex w-full justify-between'>
            <h1 className='text-3xl font-semibold'>Pagamentos</h1>
            <h2 className='text-2xl font-medium text-[#2F4ECC]'>{cityName}</h2>
          </div>
            
          <div className='w-auto flex justify-between items-end mt-2'>
            <div className='flex items-end'>
              <div className='w-72 mr-4'>
                <Input label='Pesquisar' placeholder='Pesquisar pagamento' value={cnpjSearch} onChange={e => setCnpjSearch(e.target.value)} />
              </div>
              <div className={AdminPaymentSyle.TitleButtonContainer}>
                <Button label={<AiOutlineSearch />} onPress={() => searchPayment()} isLoading={isLoading} />
              </div>
            </div>
            <div className='w-56'>
              <Button label='Exportar pagamentos' onPress={() => setModalExport(true)}/>
            </div>
          </div>

        </div>

        <div className='flex flex-col w-full h-auto rounded-md bg-[#F2F5FF] mt-8 p-4'>
          <div className='flex space-x-8'>
            <div className='w-1/2'>
              <Input label={'Data inicial da retenção'} value={initialDate} onChange={setInitialDate} />
            </div>
            <div className='w-1/2'>
              <Input label={'Data final da retenção'} value={finalDate} onChange={setFinalDate} />
            </div>
          </div>

          <div className='flex space-x-8 mt-4'>
            <div className='flex flex-col w-1/2 h-24 rounded-md border-2 items-center justify-center'>
              <span className='font-semibold'>Total bruto retido no período</span>
              <span className='text-2xl text-[#142566]'>{grossValue}</span>
            </div>
            <div className='flex flex-col w-1/2 h-24 rounded-md border-2 items-center justify-center'>
              <span className='font-semibold'>Total líquido retido no período</span>
              <span className='text-2xl text-[#18BA18]'>{netOfTaxValue}</span>
            </div>
          </div>
        </div>

        <div className='w-full border border-[#ededed] rounded mt-2 overflow-x-scroll'>
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

                  switch (rowsCallback.status) {
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
                      <chakra.Td>{rowsCallback.tax_note.split('-')[0]}</chakra.Td>
                      <chakra.Td>{moment(rowsCallback.createdAt).format('DD/MM/YYYY')}</chakra.Td>
                      <chakra.Td>{rowsCallback.company_name}</chakra.Td>
                      <chakra.Td>{formatCpfOrCnpj(rowsCallback.cnpj)}</chakra.Td>
                      <chakra.Td>{<chakra.Switch className='mr-4' size='md' isChecked={rowsCallback.enabled} />}</chakra.Td>
                      <chakra.Td><FiEye size={28} className='cursor-pointer' onClick={() => openAndCloseModal(rowsCallback)}/></chakra.Td>
                    </chakra.Tr>
                  )
                })}
              </chakra.Tbody>
            </chakra.Table>
          </chakra.Skeleton>
        </div>

        <Modal isCentered size={'xl'} title={'Pagamento'} isOpen={isOpen} modalOpenAndClose={openAndCloseModal}>
            <div className={AdminPaymentSyle.ModalBodyContainer}>
              <div className={AdminPaymentSyle.ImageModalContainer}>
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
              <div className={AdminPaymentSyle.ContentModalContainer}>
                <chakra.Tabs align='center' isFitted variant='enclosed'>
                  <chakra.TabList>
                    <chakra.Tab>Pagamento</chakra.Tab>
                    <chakra.Tab>Fornecedor</chakra.Tab>
                  </chakra.TabList>

                  <chakra.TabPanels>
                    <chakra.TabPanel>
                      <div className={AdminPaymentSyle.PaymentContentContainer}>
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

                          <div className="flex w-[32vw] p-2 bg-[#F2F5FF] items-center justify-between rounded mt-2">
                            <span className="font-semibold">Valor do Saldo de Pagamento</span>
                            <span>{fromCurrency.format(modalData?.net_of_tax)}</span>
                          </div>

                        </div>
                      </div>
                    </chakra.TabPanel>
                    <chakra.TabPanel>
                      <div className='h-[54vh] overflow-y-scroll'>
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

export default AdminPayment;