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
  const navigate = useNavigate();
  
  function openAndCloseModal () {
    setIsOpen(!isOpen);
  }

  function generateDocument (item) {
    sessionStorage.setItem('payment_id', item);
    navigate('/extrato-fornecedor'); 
  }

  useEffect(() => {
    (async () => await companyInformations({ currentPage: 1 }).then(response => {
      let companyName = `${response?.body?.company_name}`.split(' ');

      setUserName(`${companyName[0]} ${companyName[companyName.length -1]}`);
    }))()
  }, []);

  useEffect(() => {
    const paymentInserted = new Set();
    const paymentsArray = [];
    setIsLoading(false);

    (async () => await companyPanel({ currentPage: currentPage }).then(response => {
      setCountPages(response?.meta?.pageCount);

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
          <h1>Central de Renteção</h1>
        </div>

        <Modal isCentered size={'xl'} title={modalData?.company_name} isOpen={isOpen} modalOpenAndClose={openAndCloseModal}>
          {modalData?.type === 'simples' ?
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
                      <span className='font-semibold'>CNPJ</span>
                      <span>{modalData?.['computer_id_payments.computer_city_id.cnpj']}</span>
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
                <div className='flex flex-col h-96 mt-4 pb-2 overflow-y-scroll'>
                  <span className='text-xl'>Memória de cálculo da retenção</span>
                  <div>
                    <span className='font-semibold'>Imposto Sobre Serviço Retido na fonte</span>
                    <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                      <span className='font-semibold'>Base de cálculo da retenção</span>
                      <span>{fromCurrency.format(modalData?.calculation_basis)}</span>
                    </div>

                    <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                      <span className='font-semibold'>Alíquota do Imposto Sobre Serviço de Qualquer Natureza</span>
                      <span>{modalData?.index}%</span>
                    </div>

                    <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                      <span className='font-semibold'>Item</span>
                      <span>{modalData?.['company_id_payments.iss_companies_id.iss_companies_iss_services_id.iss_services_products_services_id.label'].split(' ')[0]}</span>
                    </div>

                    <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                      <span className='font-semibold'>Valor do ISS Retido na Fonte</span>
                      <span>{fromCurrency.format(modalData?.withheld_tax)}</span>
                    </div>

                    <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                      <span className='font-semibold'>Valor do Saldo de Pagamento</span>
                      <span>{fromCurrency.format(modalData?.net_of_tax)}</span>
                    </div>
                  </div>
                  {modalData?.payment_associate == null ?
                    <></>
                    :
                    <>
                      <div className='mt-4'>
                        <span className='font-semibold'>Imposto de Renda Retido na fonte</span>
                        <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                          <span className='font-semibold'>Base de cálculo da retenção</span>
                          <span>{fromCurrency.format(modalData?.['payment_associate_id.calculation_basis'])}</span>
                        </div>

                        <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                          <span className='font-semibold'>Alíquota do Imposto de Renda Retido na Fonte</span>
                          <span>{modalData?.['payment_associate_id.index']}%</span>
                        </div>

                        <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                          <span className='font-semibold'>Código da Receita</span>
                          <span>{modalData?.['company_id_payments.products_services_id_company.code']}</span>
                        </div>

                        <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                          <span className='font-semibold'>Valor do IR Retido na Fonte</span>
                          <span>{fromCurrency.format(modalData?.['payment_associate_id.withheld_tax'])}</span>
                        </div>

                        <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                          <span className='font-semibold'>Valor do Saldo de Pagamento</span>
                          <span>{fromCurrency.format(modalData?.['payment_associate_id.net_of_tax'])}</span>
                        </div>

                        <div className='flex w-full bg-[#F2F5FF] p-2 mt-8 rounded justify-between'>
                          <span className='font-semibold'>Valor total do Saldo de Pagamento</span>
                          <span>{fromCurrency.format( Number(modalData?.value) - (Number(modalData?.withheld_tax) + Number(modalData?.['payment_associate_id.withheld_tax'])))}</span>
                        </div>
                      </div>
                    </>
                  }
                  
                </div>
              </div>
            </>
            :
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
                      <span className='font-semibold'>CNPJ</span>
                      <span>{modalData?.['computer_id_payments.computer_city_id.cnpj']}</span>
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
                <div className='flex flex-col h-96 mt-4 pb-2 overflow-y-scroll'>
                  <span className='text-xl'>Memória de cálculo da retenção</span>
                  <span className='font-semibold'>Imposto de Renda Retido na fonte</span>
                  <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                    <span className='font-semibold'>Base de cálculo da retenção</span>
                    <span>{fromCurrency.format(modalData?.calculation_basis)}</span>
                  </div>

                  <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                    <span className='font-semibold'>Alíquota do Imposto de Renda</span>
                    <span>{modalData?.index}%</span>
                  </div>

                  <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                    <span className='font-semibold'>Código da Receita</span>
                    <span>{modalData?.['company_id_payments.products_services_id_company.code']}</span>
                  </div>

                  <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                    <span className='font-semibold'>Valor do IRRF Retido na Fonte</span>
                    <span>{fromCurrency.format(modalData?.withheld_tax)}</span>
                  </div>

                  <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                    <span className='font-semibold'>Valor do Saldo de Pagamento</span>
                    <span>{fromCurrency.format(modalData?.net_of_tax)}</span>
                  </div>

                  {modalData?.payment_associate == null ?
                    <>
                      
                    </>
                    :
                    <>
                      <div>
                        <span className='font-semibold'>Imposto Sobre Serviço Retido na fonte</span>
                        <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                          <span className='font-semibold'>Base de cálculo da retenção</span>
                          <span>{fromCurrency.format(modalData?.['payment_associate_id.calculation_basis'])}</span>
                        </div>

                        <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                          <span className='font-semibold'>Alíquota do Imposto Sobre Serviço de Qualquer Natureza</span>
                          <span>{modalData?.['payment_associate_id.index']}%</span>
                        </div>

                        <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                          <span className='font-semibold'>Item</span>
                          <span>{modalData?.['company_id_payments.iss_companies_id.iss_companies_iss_services_id.iss_services_products_services_id.label'].split(' ')[0]}</span>
                        </div>

                        <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                          <span className='font-semibold'>Valor do ISS Retido na Fonte</span>
                          <span>{fromCurrency.format(modalData?.['payment_associate_id.withheld_tax'])}</span>
                        </div>

                        <div className='flex w-full bg-[#F2F5FF] p-2 mt-2 rounded justify-between'>
                          <span className='font-semibold'>Valor do Saldo de Pagamento</span>
                          <span>{fromCurrency.format(modalData?.['payment_associate_id.net_of_tax'])}</span>
                        </div>

                        <div className='flex w-full bg-[#F2F5FF] p-2 mt-8 rounded justify-between'>
                          <span className='font-semibold'>Valor total do Saldo de Pagamento</span>
                          <span>{fromCurrency.format( Number(modalData?.value) - (Number(modalData?.withheld_tax) + Number(modalData?.['payment_associate_id.withheld_tax'])))}</span>
                        </div>
                      </div>
                    </>
                  }


                </div>
              </div>
            </>
          }
        </Modal>

        {
          paymentsData.length > 0 ? 
          <div className={SupplierHomeStyle.TableContainer}>
            <chakra.Skeleton className="w-full h-auto" isLoaded={isLoading}>
              <chakra.TableContainer>
                <chakra.Table variant='simple' size='lg'>
                  <chakra.Thead>
                    <chakra.Tr>
                      <chakra.Th>Nota fiscal</chakra.Th>
                      <chakra.Th>Data</chakra.Th>
                      <chakra.Th>Cidade</chakra.Th>
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
                            <chakra.Td>{paymentsDataCallback?.['computer_id_payments.computer_city_id.label']}</chakra.Td>
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

export default SupplierHome;