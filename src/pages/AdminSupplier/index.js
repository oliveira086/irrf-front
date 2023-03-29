import { useState, useEffect, useMemo } from 'react';
import {
  BrowserRouter as Router,
  useLocation,
  useNavigate 
} from "react-router-dom";
import * as chakra from '@chakra-ui/react';

import { AiOutlineSearch, AiOutlinePlus, AiOutlineCloseCircle, AiOutlineCheckCircle } from "react-icons/ai";
import { FiEye, FiX } from "react-icons/fi";
import { TbEdit } from "react-icons/tb";

import Header from '../../components/molecules/Header';
import Button from "../../components/atoms/Button";
import Input from "../../components/atoms/Input";
import Modal from "../../components/atoms/Modal";
import Pagination from "../../components/molecules/Pagination";

import { formatCpfOrCnpj } from '../../utils/formatCpfAndCnpj';

import { getUserInformations } from "../../services/authServices";
import { getAllCompaniesAdmin } from "../../services/companyServices";


import { AdminSupplierStyle } from './style';

const AdminSupplier = () => {
  const [userName, setUserName] = useState('');
  const [cityName, setCityName] = useState('');

  const [countPages, setCountPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [audited, setAudited] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState();

  const [rows, setRows] = useState([]);

  const [cnpj, setCnpj] = useState('');

  const query = useQuery();
  const navigate = useNavigate();


  function useQuery() {
    const { search } = useLocation();
  
    return useMemo(() => new URLSearchParams(search), [search]);
  }

  async function openAndCloseModal(data) {
		console.log(data);
    setModalData(data);
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    (async () => {
      await getUserInformations().then(response => {
        setUserName(response.body.user_name);
        setCityName(response.body.city_name);
      });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await getAllCompaniesAdmin({ city_id: query.get("cityId"), audited: audited }, { currentPage: currentPage }).then(response => {
        setRows(response.body.rows);
        setCountPages(response.body.meta.pageCount);
      })
    })()
  }, [currentPage, audited]);


  return (
    <section className={AdminSupplierStyle.Container}>
      <Header userName={userName} cityName={cityName} />
      <div className={AdminSupplierStyle.BodyContainer}>
        <div className={AdminSupplierStyle.TitleContainer}>
          <div className='flex w-full justify-between'>
            <h1 className='text-3xl font-semibold'>Fornecedores</h1>
            <h2 className='text-2xl font-medium text-[#2F4ECC]'>Jaíba</h2>
          </div>
            
          <div className='w-auto flex justify-between items-end mt-2'>
            <div className='flex items-end'>
              <div className='w-72 mr-4'>
                <Input label='Pesquisar' placeholder='Pesquisar Fornecedor' value={cnpj} onChange={e => setCnpj(e.target.value)} />
              </div>
              <div className={AdminSupplierStyle.TitleButtonContainer}>
                <Button label={<AiOutlineSearch />} onPress={() => {}} />
              </div>
            </div>
            <div className='w-56'>
              <Button label={<><AiOutlinePlus className='mr-4'/><span>Cadastrar Fornecedor</span></>} onPress={() => {}} />
            </div>
          </div>
        </div>
        <div className='w-full mt-2'>
          <chakra.Switch className='mr-4' size='md' isChecked={audited} onChange={(e) => {setAudited(!audited)}} />
          <span>Mostrar somente não auditados</span>
        </div>

        <div className='w-full border border-[#ededed] rounded mt-2 overflow-x-scroll'>
          <chakra.Skeleton className="w-full h-[60vh] mt-4" isLoaded={rows.length > 0 ? true : false}>
            <chakra.Table variant='simple' size='lg'>
              <chakra.Thead>
                <chakra.Tr>
                  <chakra.Th>Nome da Empresa</chakra.Th>
                  <chakra.Th>CNPJ</chakra.Th>
                  <chakra.Th>Email</chakra.Th>
                  <chakra.Th>Auditado</chakra.Th>
                  <chakra.Th></chakra.Th>
                  <chakra.Th></chakra.Th>
                </chakra.Tr>
              </chakra.Thead>

              <chakra.Tbody>
                {rows.map(rowsCallback => {
                  return (
                    <chakra.Tr>
                      <chakra.Td>{rowsCallback.label}</chakra.Td>
                      <chakra.Td>{formatCpfOrCnpj(rowsCallback.cnpj)}</chakra.Td>
                      <chakra.Td>{rowsCallback.email}</chakra.Td>
                      <chakra.Td>{<chakra.Switch className='mr-4' size='md' isChecked={rowsCallback.enabled} />}</chakra.Td>
                      <chakra.Td><FiEye size={28} className='cursor-pointer' onClick={() => openAndCloseModal(rowsCallback)}/></chakra.Td>
                      <chakra.Td><TbEdit size={28}/></chakra.Td>
                    </chakra.Tr>
                  )
                })}
              </chakra.Tbody>
            </chakra.Table>
          </chakra.Skeleton>
        </div>
        <Modal isCentered size={'xl'} title={'Fornecedor'} isOpen={isOpen} modalOpenAndClose={openAndCloseModal}>
					<div className={AdminSupplierStyle.ModalBody}>
						<div className={AdminSupplierStyle.ModalContentRow}>
							<div className={AdminSupplierStyle.ModalItem}>
								<span className='font-semibold'>Nome da Empresa</span>
								<span>{modalData?.label}</span>
							</div>

							<div className={AdminSupplierStyle.ModalItem}>
								<span className='font-semibold'>CNPJ</span>
								<span>{formatCpfOrCnpj(modalData?.cnpj)}</span>
							</div>

							<div className={AdminSupplierStyle.ModalItem}>
								<span className='font-semibold'>Email</span>
								<span>{modalData?.email}</span>
							</div>

						</div>

						<div className={AdminSupplierStyle.ModalContentRow}>
							<div className={AdminSupplierStyle.ModalItem}>
								<span className='font-semibold'>Telefone</span>
								<span>{modalData?.phone}</span>
							</div>

							<div className={AdminSupplierStyle.ModalItem}>
								<span className='font-semibold'>Produto / Serviço</span>
								<span>{modalData?.['products_services_id_company.label']}</span>
							</div>

							<div className={AdminSupplierStyle.ModalItem}>
								<span className='font-semibold'>ISS item</span>
								<span>{modalData?.['iss_companies_id.iss_companies_iss_services_id.iss_services_products_services_id.label']}</span>
							</div>
						</div>

						<div className={AdminSupplierStyle.ModalContentRow}>
							<div className='flex flex-col p-2 rounded bg-[#F2F5FF] min-w-full'>
								<span className='font-semibold'>Objeto</span>
								<span>{modalData?.object}</span>
							</div>
						</div>
						
						<div className='w-full pl-2 mb-2'>
							<div><span className='text-xl'>Localização</span></div>
							<div className='flex flex-col'>
								<span className='font-semibold'>Endereço</span>
								<span>{`${modalData?.address}, ${modalData?.number} - ${modalData?.district}, ${modalData?.city} - ${modalData?.uf}, ${modalData?.cep}`}</span>
							</div>
						</div>
						<chakra.Divider orientation='horizontal' />

						<div className='flex flex-col w-full pl-2 pb-2'>
							<span className='text-xl'>Informações Complementares</span>
							<div className='w-full flex flex-wrap justify-between'>
								<div className='flex w-56 p-2 bg-[#ededed] rounded items-center justify-center mt-2'>
									{modalData?.is_service == true ? <AiOutlineCheckCircle size={20} color={'#18BA18'}/> : <AiOutlineCloseCircle size={20} color={'#BB0000'}/>}
									<span className='font-semibold ml-4'>Fornece serviço</span>
								</div>

								<div className='flex w-56 p-2 bg-[#ededed] rounded items-center justify-center mt-2'>
									{modalData?.is_product == true ? <AiOutlineCheckCircle size={20} color={'#18BA18'}/> : <AiOutlineCloseCircle size={20} color={'#BB0000'}/>}
									<span className='font-semibold ml-4'>Fornece Produto</span>
								</div>

								<div className='flex w-56 p-2 bg-[#ededed] rounded items-center justify-center mt-2'>
									{modalData?.is_simple == true ? <AiOutlineCheckCircle size={20} color={'#18BA18'}/> : <AiOutlineCloseCircle size={20} color={'#BB0000'}/>}
									<span className='font-semibold ml-4'>Simples</span>
								</div>

								<div className='flex w-56 p-2 bg-[#ededed] rounded items-center justify-center mt-2'>
									{modalData?.is_exempt_irrf == true ? <AiOutlineCheckCircle size={20} color={'#18BA18'}/> : <AiOutlineCloseCircle size={20} color={'#BB0000'}/>}
									<span className='font-semibold ml-4'>Isento IR</span>
								</div>

								<div className='flex w-56 p-2 bg-[#ededed] rounded items-center justify-center mt-2'>
									{modalData?.is_exempt_iss == true ? <AiOutlineCheckCircle size={20} color={'#18BA18'}/> : <AiOutlineCloseCircle size={20} color={'#BB0000'}/>}
									<span className='font-semibold ml-4'>Isento ISS</span>
								</div>

								<div className='flex w-56 p-2 bg-[#ededed] rounded items-center justify-center mt-2'>
									{modalData?.is_immune_irrf == true ? <AiOutlineCheckCircle size={20} color={'#18BA18'}/> : <AiOutlineCloseCircle size={20} color={'#BB0000'}/>}
									<span className='font-semibold ml-4'>Imune IR</span>
								</div>

								<div className='flex w-56 p-2 bg-[#ededed] rounded items-center justify-center mt-2'>
									{modalData?.is_immune_iss == true ? <AiOutlineCheckCircle size={20} color={'#18BA18'}/> : <AiOutlineCloseCircle size={20} color={'#BB0000'}/>}
									<span className='font-semibold ml-4'>Imune ISS</span>
								</div>
							</div>
						</div>
					</div>
				</Modal>
      
        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pages={countPages} />
      </div>

    </section>
  )
}

export default AdminSupplier;