import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import * as chakra from '@chakra-ui/react';
import { FiEye } from 'react-icons/fi';
import { AiOutlineSearch } from "react-icons/ai";
import { Player } from '@lottiefiles/react-lottie-player';

import Header from '../../components/molecules/Header';
import Input from "../../components/atoms/Input";
import Button from '../../components/atoms/Button';
import Modal from '../../components/atoms/Modal';
import Pagination from '../../components/molecules/Pagination';

import { formatCpfOrCnpj } from '../../utils/formatCpfAndCnpj';

import { getUserInformations } from '../../services/authServices';
import { getAllCompanies, getCompanyByCnpj } from '../../services/companyServices';

import { CompaniesStyle } from './style';

const Companies = () => {

  const [companyData, setCompanyData] = useState([]);
  const [userName, setUserName] = useState('');
  const [cityName, setCityName] = useState('');
  const [cityId, setCityId] = useState('');
  const [modalData, setModalData] = useState();
  const [isOpen, setIsOpen] = useState();
  const [cnpjSearch, setCnpjSearch] = useState();
  const [enabled, setEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [countPages, setCountPages] = useState(1);

  function openAndCloseModal () {
    setIsOpen(!isOpen);
  }

  async function searchPayment () {
    setIsLoading(true);
    if(cnpjSearch == '') {
      (async () => await getAllCompanies({ currentPage: currentPage, enabled: enabled }).then(response => {
        setCompanyData(response.body.rows);
        setCountPages(response.body.meta.pageCount);
        setIsLoading(false);
      }))()
    } else {
      const removeDotToCnpj = cnpjSearch.replace(/[^\w\s]/gi, '').trim();
      const response =  await getCompanyByCnpj({ cnpj: removeDotToCnpj, city_id: cityId });
      setCompanyData(response.body);
      setCnpjSearch('');
      setIsLoading(false);
    }
  } 

  useEffect(() => {
    (async () => await getUserInformations({ currentPage: 1 }).then(response => {
      setCityId(response.body.city_id);
      setUserName(response.body.user_name);
      setCityName(response.body.city_name);
    }))();
  }, []);

  useEffect(() => {
    (async () => await getAllCompanies({ currentPage: currentPage, enabled: enabled }).then(response => {
      setCompanyData(response.body.rows);
      setCountPages(response.body.meta.pageCount);
    }))()
  }, [currentPage]);

  return (
    <section className={CompaniesStyle.Container}>
      <Header userName={userName} cityName={cityName} />
      <div className={CompaniesStyle.BodyContainer}>
        <div className={CompaniesStyle.TitleContainer}>
          <div>
            <h1 className='text-3xl font-semibold'>Central de Renteção</h1>
            <div className='w-auto flex items-end mt-2'>
              <div className='w-72 mr-4'>
                <Input label='Pesquisar' placeholder='Pesquisar por CNPJ' value={cnpjSearch} onChange={e => setCnpjSearch(e.target.value)} />
              </div>
              <div className={CompaniesStyle.TitleButtonContainer}>
                <Button label={<AiOutlineSearch />} onPress={searchPayment} isLoading={isLoading} />
              </div>
            </div>
            <div className='w-80 mt-4 justify-center items-center'>
              <span className='mr-6 font-semibold'>Exibir Empresas Auditadas</span>
              <chakra.Switch isChecked={enabled} onChange={(e) => {setEnabled(!enabled)}} />
            </div>
          </div>
          <div className={CompaniesStyle.TitleButtonContainer}>
            <Button label='Cadastrar Fornecedor'/>
          </div>
        </div>


        <Modal isCentered size={'xl'} title={modalData?.label} isOpen={isOpen} modalOpenAndClose={openAndCloseModal}>
          <div className='h-auto'>

            <div className='flex mb-2 justify-between'>
              <div className='flex flex-col w-72 p-2 bg-[#F2F5FF] items-start rounded'>
                <span className='font-semibold'>Nome:</span>
                <span>{modalData?.label}</span>
              </div>
              <div className='flex flex-col w-72 p-2 bg-[#F2F5FF] items-start rounded'>
                <span className='font-semibold'>CNPJ:</span>
                <span>{formatCpfOrCnpj(modalData?.cnpj)}</span>
              </div>
              <div className='flex flex-col w-72 p-2 bg-[#F2F5FF] items-start rounded'>
                <span className='font-semibold'>Email:</span>
                <span>{modalData?.email}</span>
              </div>
            </div>

            <div className='flex justify-between mb-2'>
              <div className='flex flex-col w-72 p-2 bg-[#F2F5FF] items-start rounded'>
                <span className='font-semibold'>Objeto:</span>
                <span>{modalData?.object}</span>
              </div>
              <div className='flex flex-col w-72 p-2 bg-[#F2F5FF] items-start rounded'>
                <span className='font-semibold'>Telefone:</span>
                <span>{modalData?.phone}</span>
              </div>
              <div className='flex flex-col w-72 p-2 bg-[#F2F5FF] items-start rounded'>
                <span className='font-semibold'>CEP:</span>
                <span>{modalData?.cep}</span>
              </div>
            </div>

            <div className='flex mb-2'>
              <div className='flex flex-col w-full p-2 bg-[#F2F5FF] items-start rounded'>
                <span className='font-semibold'>Endereço:</span>
                <span>{`Rua ${modalData?.address}, ${modalData?.number} - ${modalData?.district}, ${modalData?.complement} - ${modalData?.city} - ${modalData?.uf}`}</span>
              </div>
            </div>

            <div className='flex'>
              <div className='flex flex-col w-full p-2 bg-[#F2F5FF] items-start rounded'>
                <span className='font-semibold'>Informações Complementares:</span>
                <div><chakra.Switch isChecked={modalData?.is_service} className='mr-2' /><span>Fornece Serviço</span></div>
                <div><chakra.Switch isChecked={modalData?.is_product} className='mr-2' /><span>Fornece Produto</span></div>
                <div><chakra.Switch isChecked={modalData?.is_exempt_irrf} className='mr-2' /><span>Isento ISS</span></div>
                <div><chakra.Switch isChecked={modalData?.is_exempt_iss} className='mr-2' /><span>Isento IRRF</span></div>
                <div><chakra.Switch isChecked={modalData?.is_immune_iss} className='mr-2' /><span>Imune ISS</span></div>
                <div><chakra.Switch isChecked={modalData?.is_immune_irrf} className='mr-2' /><span>Imune IRRF</span></div>
                <div><chakra.Switch isChecked={modalData?.art_3} className='mr-2' /><span>Artigo 3º</span></div>
                <div><chakra.Switch isChecked={modalData?.non_incidence} className='mr-2' /><span>Não incidente</span></div>
              </div>
            </div>
          </div>
        </Modal>

        {
          companyData.length > 0 ? 
          <div className={CompaniesStyle.TableContainer}>
            <chakra.TableContainer>
              <chakra.Table variant='simple' size='lg'>
                <chakra.Thead>
                  <chakra.Tr>
                    <chakra.Th>Nome</chakra.Th>
                    <chakra.Th>CNPJ</chakra.Th>
                    <chakra.Th>Objeto</chakra.Th>
                    <chakra.Th>Auditado</chakra.Th>
                    <chakra.Th></chakra.Th>
                  </chakra.Tr>
                </chakra.Thead>
                <chakra.Tbody>
                  {companyData.map(companyDataCallback => {
                    return (
                      <>
                        <chakra.Tr>
                          <chakra.Td>{companyDataCallback.label}</chakra.Td>
                          <chakra.Td>{formatCpfOrCnpj(companyDataCallback.cnpj)}</chakra.Td>
                          <chakra.Td>{companyDataCallback.object}</chakra.Td>
                          <chakra.Td><chakra.Switch isChecked={companyDataCallback.enabled} /></chakra.Td>
                          <chakra.Td><FiEye size={28} className='cursor-pointer' onClick={() => {openAndCloseModal(); setModalData(companyDataCallback)}} /></chakra.Td>
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
}

export default Companies;