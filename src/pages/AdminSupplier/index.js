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
import Select from "../../components/atoms/Select";
import Modal from "../../components/atoms/Modal";
import UploadFile from '../../components/atoms/UploadFile';
import Pagination from "../../components/molecules/Pagination";

import { formatCpfOrCnpj } from '../../utils/formatCpfAndCnpj';

import { getUserInformations } from "../../services/authServices";
import { getAllCompaniesAdmin, findCompanyByCNPJ } from "../../services/companyServices";
import { getAllProducts, getAllServices } from "../../services/servicesAndProductServices";
import { registerCompany } from "../../services/companyServices";


import { AdminSupplierStyle } from './style';

const AdminSupplier = () => {
  const [userName, setUserName] = useState('');
  const [cityName, setCityName] = useState('');
  const [cnpjSearch, setCnpjSearch] = useState('');

  const [countPages, setCountPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [audited, setAudited] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState();

  const [RegisterSupplierIsOpen, setRegisterSupplierIsOpen] = useState(false);
  const [productAndServices, setProductAndServices] = useState([]);
  const [productAndServicesSelected, setProductAndServicesSelected ] = useState();

  const [issItems, setIssItems] = useState([]);
  const [issItemSelected, setIssItemSelected] = useState();

  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [objectToContract, setObjectToContract] = useState('');
  const [address, setAddress] = useState('');
  const [cep, setCep] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [uf, setUf] = useState('');

  const [isProduct, setIsProduct] = useState(false);
  const [isService, setIsService] = useState(false);
  const [isSimple, setIsSimple] = useState(false);
  const [isSimei, setIsSimei] = useState(false);
  const [isExemptIR, setIsExemptIR] = useState(false);
  const [isExemptISS, setIsExemptISS] = useState(false);
  const [isImmuneIss, setIsImmuneIss] = useState(false);
  const [isImmuneIR, setIsImmuneIR] = useState(false);

  const [fileUpload, setFileUpload] = useState();

  const [rows, setRows] = useState([]);

  const [cnpj, setCnpj] = useState('');

  const query = useQuery();
  const navigate = useNavigate();

  function useQuery() {
    const { search } = useLocation();
  
    return useMemo(() => new URLSearchParams(search), [search]);
  }

  async function openAndCloseModal(data) {
    setModalData(data);
    setIsOpen(!isOpen);
  }

  async function openAndCloseRegisterSupplier() {

    setRegisterSupplierIsOpen(!RegisterSupplierIsOpen);
    getAllProducts().then(response => {
      setProductAndServices(response.body)
    });

    getAllServices().then(response => {
      setIssItems(response.body);
    });
  }

  function handleUploadFile(files) {
    setFileUpload(files[0]);
  }

  async function searchCompanyByCnpj() {
    await findCompanyByCNPJ({ cnpj: cnpj, city_id: query.get("cityId") }).then(response => {
      setCompanyName(response.body?.razao_social);
      setCep(response.body?.cep);
      setDistrict(response.body?.bairro);
      setCity(response.body?.municipio);
      setState(response.body?.uf);
      setNumber(response.body?.numero);
      setIsSimple(response?.body?.opcao_pelo_simples);
      setAddress(response?.body?.logradouro);
      setUf(response?.body?.uf);
    }) 
  }

  async function registerCompany () {

    const objectToSaveCompany = {
      "city_id": query.get("cityId"),
      "products_services_id": productAndServicesSelected?.id,
      "label": companyName,
      "cnpj": cnpj,
      "email": email,
      "object": objectToContract,
      "phone": phone,
      "aliquot": productAndServicesSelected?.['index_values_id_products.value'],
      "address": address,
      "district": district,
      "complement": complement,
      "cep": cep,
      "number": number,
      "city": city,
      "uf": uf,
      "is_simple": isSimple,
      "is_simei": isSimei,
      "is_product": isProduct,
      "is_service": isService,
      "is_exempt_irrf": isExemptIR,
      "is_exempt_iss": isExemptISS,
      "is_immune_irrf": isImmuneIR,
      "is_immune_iss": isImmuneIss,
      "iss_services_id": issItemSelected?.id
    }

    registerCompany(objectToSaveCompany).then(response => {
      console.log(response);
    });

  }

  useEffect(() => {
    (async () => {
      await getUserInformations().then(response => {
        setUserName(response.body.user_name);
      });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await getAllCompaniesAdmin({ city_id: query.get("cityId"), audited: audited }, { currentPage: currentPage }).then(response => {
        setRows(response.body.rows);
        setCountPages(response.body.meta.pageCount);
        setCityName(response?.body?.rows[0]?.['company_city_id.label']);
      })
    })()
  }, [currentPage, audited]);

  useEffect(() => {

    if(productAndServicesSelected?.product_or_service == false) {
      setIsService(true);
      setIsProduct(false);
    } else if(productAndServicesSelected?.product_or_service == true) {
      setIsProduct(true);
      setIsService(false);
    }
    
  }, [productAndServicesSelected])


  return (
    <section className={AdminSupplierStyle.Container}>
      <Header userName={userName} cityName={cityName} />
      <div className={AdminSupplierStyle.BodyContainer}>
        <div className={AdminSupplierStyle.TitleContainer}>
          <div className='flex w-full justify-between'>
            <h1 className='text-3xl font-semibold'>Fornecedores</h1>
            <h2 className='text-2xl font-medium text-[#2F4ECC]'>{cityName}</h2>
          </div>
            
          <div className='w-auto flex justify-between items-end mt-2'>
            <div className='flex items-end'>
              <div className='w-72 mr-4'>
                <Input label='Pesquisar' placeholder='Pesquisar Fornecedor' value={cnpjSearch} onChange={e => setCnpjSearch(e.target.value)} />
              </div>
              <div className={AdminSupplierStyle.TitleButtonContainer}>
                <Button label={<AiOutlineSearch />} onPress={() => {}} />
              </div>
            </div>
            <div className='w-56'>
              <Button label={<><AiOutlinePlus className='mr-4'/><span>Cadastrar Fornecedor</span></>} onPress={openAndCloseRegisterSupplier} />
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

        <Modal isCentered size={'xl'} title={'Cadastro de Fornecedor'} isOpen={RegisterSupplierIsOpen} modalOpenAndClose={openAndCloseRegisterSupplier} >
          <div className='w-full h-[60vh] overflow-y-scroll pl-2'>
            <div className={AdminSupplierStyle.ModalContentRow}>
              <span className='text-xl font-semibold'>Dados da Empresa</span>
            </div>
            
            <div className='flex justify-between mb-2'>
              <div className='flex w-auto items-end'>
                <div className='w-96 mr-2'>
                  <Input label='CNPJ' placeholder='CNPJ' value={cnpj} onChange={e => setCnpj(e.target.value)} />
                </div>
              
                <div className={AdminSupplierStyle.TitleButtonContainer}>
                  <Button label={<AiOutlineSearch />} onPress={searchCompanyByCnpj} />
                </div>
              </div>

              <div className='w-5/12'>
                <Input label='Email' placeholder='Nome Fantasia ou Razão Social' value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              
            </div>
            <div className='flex justify-between mb-2'>
              <div className='w-5/12'>
                <Input label='Nome' placeholder='Nome Fantasia ou Razão Social' value={companyName} onChange={e => setCompanyName(e.target.value)} />
              </div>

              <div className='w-5/12'>
                <Input label='Telefone' placeholder='Telefone' value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
            </div>

            <div>
              <Select placeholder={'Produto / Serviço'} options={productAndServices} setSelectedValue={setProductAndServicesSelected} selectedValue={productAndServicesSelected} />       
            </div>
            
            {productAndServicesSelected?.product_or_service == false ?
              <div>
                <Select placeholder={'Item ISS'} options={issItems} setSelectedValue={setIssItemSelected} selectedValue={issItemSelected} />
              </div>
              :
              <></>
            }

            <div className='mb-2'>
              <Input label='Objeto do contrato' placeholder='Objeto do contrato' value={objectToContract} onChange={e => setObjectToContract(e.target.value)} />
            </div>

            <div>
              <span className='text-xl mt-2'>Localização</span>
            </div>

            <div className='flex justify-between mb-2'>
              <div className='w-5/12'>
                <Input label='Estado' placeholder='Estado' value={state} onChange={e => setState(e.target.value)} />
              </div>

              <div className='w-5/12'>
                <Input label='Cidade' placeholder='Cidade' value={city} onChange={e => setCity(e.target.value)} />
              </div>
            </div>

            <div className='flex justify-between mb-2'>
              <div className='w-5/12'>
                <Input label='CEP' placeholder='CEP' value={cep} onChange={e => setCep(e.target.value)} />
              </div>

              <div className='w-5/12'>
                <Input label='Rua' placeholder='Rua' value={address} onChange={e => setAddress(e.target.value)} />
              </div>
            </div>

            <div className='flex justify-between mb-2'>
              <div className='w-72'>
                <Input label='Bairro' placeholder='Bairro' value={district} onChange={e => setDistrict(e.target.value)} />
              </div>

              <div className='w-96'>
                <Input label='Cidade' placeholder='Rua' value={city} onChange={e => setCity(e.target.value)} />
              </div>

              <div className='w-72'>
                <Input label='Número' placeholder='Número' value={number} onChange={e => setNumber(e.target.value)} />
              </div>
            </div>
            
            <div className='mb-2'>
              <Input label='Complemento' placeholder='Complemento' value={complement} onChange={e => setComplement(e.target.value)} />
            </div>

            <div>
              <span className='text-xl'>Informações Complementares</span>
            </div>

            <div className='mb-4'>
              <div>
                <chakra.Switch isChecked={isService} onChange={(e) => {setIsService(!isService)}} />
                <span className='ml-2'>Fornece Serviço</span>
              </div>

              <div>
                <chakra.Switch isChecked={isProduct} onChange={(e) => {setIsProduct(!isProduct)}} />
                <span className='ml-2'>Fornece Produto</span>
              </div>

              <div>
                <chakra.Switch isChecked={isSimple} onChange={(e) => {setIsSimple(!isSimple)}} />
                <span className='ml-2'>Optante pelo simples</span>
              </div>

              <div>
                <chakra.Switch  isChecked={isSimei} onChange={(e) => {setIsSimei(!isSimei)}} />
                <span className='ml-2'>Simei</span>
              </div>

              <div>
                <chakra.Switch isChecked={isExemptISS} onChange={(e) => {setIsExemptISS(!isExemptISS)}} />
                <span className='ml-2'>Isento ISS</span>
              </div>

              <div>
                <chakra.Switch isChecked={isExemptIR} onChange={(e) => {setIsExemptIR(!isExemptIR)}} />
                <span className='ml-2'>Isento IRRF</span>
              </div>

              <div>
                <chakra.Switch isChecked={isImmuneIss} onChange={(e) => {setIsImmuneIss(!isImmuneIss)}} />
                <span className='ml-2'>Imune ISS</span>
              </div>

              <div>
                <chakra.Switch isChecked={isImmuneIR} onChange={(e) => {setIsImmuneIR(!isImmuneIR)}} />
                <span className='ml-2'>Imune IRRF</span>
              </div>
            </div>

            <div className='flex flex-col h-auto min-h-[10vh]'>
              <span className='text-xl'>Anexar Arquivo</span>
              <div className='w-72 mt-2'>
                <UploadFile title="Anexar Objeto do contrato"
                  onUpload={handleUploadFile}
                  accept={{'image/pdf': ['.pdf', '.png', '.jpg', '.jpeg']}}
                  file={fileUpload}
                />
              </div>
            </div>

            <div className='flex pl-20 pr-20 justify-between mt-6 mb-6'>
              <div className='w-56'>
                <Button label='Cancelar' type='second' onPress={openAndCloseRegisterSupplier}/>
              </div>

              <div className='w-56'>
                <Button label='Salvar' onPress={registerCompany}/>
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