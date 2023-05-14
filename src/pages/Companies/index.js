import { useState, useEffect, useMemo } from 'react';
import { useNavigate, BrowserRouter as Router, useLocation } from "react-router-dom";
import * as chakra from '@chakra-ui/react';
import { FiEye } from 'react-icons/fi';
import { AiOutlineSearch } from "react-icons/ai";
import { Player } from '@lottiefiles/react-lottie-player';

import Header from '../../components/molecules/Header';
import Input from "../../components/atoms/Input";
import Button from '../../components/atoms/Button';
import Modal from '../../components/atoms/Modal';
import Pagination from '../../components/molecules/Pagination';
import Select from "../../components/atoms/Select";
import UploadFile from '../../components/atoms/UploadFile';


import { formatCpfOrCnpj } from '../../utils/formatCpfAndCnpj';

import { getUserInformations } from '../../services/authServices';
import { getAllCompanies, getCompanyByCnpj, findCompanyByCNPJ } from '../../services/companyServices';
import { getAllProducts, getAllServices } from "../../services/servicesAndProductServices";

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

  const [isOpenCompanyRegister, setIsOpenCompanyRegister] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [cnpj, setCnpj] = useState('');
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

  const [productAndServices, setProductAndServices] = useState([]);
  const [productAndServicesSelected, setProductAndServicesSelected ] = useState();

  const [isProduct, setIsProduct] = useState(false);
  const [isService, setIsService] = useState(false);
  const [isSimple, setIsSimple] = useState(false);
  const [isSimei, setIsSimei] = useState(false);
  const [isExemptIR, setIsExemptIR] = useState(false);
  const [isExemptISS, setIsExemptISS] = useState(false);
  const [isImmuneIss, setIsImmuneIss] = useState(false);
  const [isImmuneIR, setIsImmuneIR] = useState(false);

  const [fileUpload, setFileUpload] = useState();

  const navigate = useNavigate();
  const query = useQuery();
  const toast = chakra.useToast();

  function openAndCloseModal () {
    setIsOpen(!isOpen);
  }

  function openAndCloseRegisterCompanyModal () {
    setIsOpenCompanyRegister(!isOpenCompanyRegister);
    
    getAllProducts().then(response => {
      setProductAndServices(response.body)
    });

    getAllServices().then(response => {
      setIssItems(response.body);
    });
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

  function handleUploadFile(files) {
    setFileUpload(files[0]);
  }

  function useQuery() {
    const { search } = useLocation();
  
    return useMemo(() => new URLSearchParams(search), [search]);
  }

  async function searchCompanyByCnpj() {
    await findCompanyByCNPJ({ cnpj: cnpj, city_id: cityId }).then(response => {
      setCompanyName(response.body?.razao_social);
      setCep(response.body?.cep);
      setDistrict(response.body?.bairro);
      setCity(response.body?.municipio);
      setState(response.body?.uf);
      setNumber(response.body?.numero);
      setIsSimple(response?.body?.opcao_pelo_simples);
      setAddress(response?.body?.logradouro);
      setUf(response?.body?.uf);
    }).catch(async error => {
      await openAndCloseRegisterSupplier();
      toast({
        title: 'Esse fornecedor não pode ser cadastrado!',
        status: 'error',
        position: 'top-right',
        isClosable: true,
      });
    });
  }

  async function resetState () {
    setCompanyName('');
    setEmail('');
    setPhone('');
    setObjectToContract('');
    setAddress('');
    setCep('');
    setState('');
    setCity('');
    setDistrict('');
    setNumber('');
    setComplement('');
    setUf('');

    setIsProduct(false);
    setIsService(false);
    setIsSimple(false);
    setIsSimei(false);
    setIsExemptIR(false);
    setIsExemptISS(false);
    setIsImmuneIR(false);
    setIsImmuneIss(false);
  }

  async function registerCompanyFunction () {

    const objectToSaveCompany = {
      "city_id": cityId,
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


    // await registerCompany(objectToSaveCompany).then(async responseToRegisterCompany => {

    //   if(fileUpload == undefined || fileUpload == null) {
    //     toast({
    //       title: 'Anexe o contrato e tente novamente!',
    //       status: 'warn',
    //       position: 'top-right',
    //       isClosable: true,
    //     });
    //   } else {

    //     const formData = new FormData();
    //     formData.append('file', fileUpload);

    //     await uploadReceiptCompany(formData, responseToRegisterCompany.company_id).then(resposenUploadContract => {

    //     }).catch(error => {
          
    //       toast({
    //         title: 'Erro ao salvar o objeto do contrato!',
    //         status: 'error',
    //         position: 'top-right',
    //         isClosable: true,
    //       });
    //     })
    //   }

    //   await openAndCloseRegisterSupplier();
    //   await resetState();
    //   toast({
    //     title: 'Fornecedor Cadastrado!',
    //     status: 'success',
    //     position: 'top-right',
    //     isClosable: true,
    //   });
    // }).catch(error => {
    //   toast({
    //     title: 'Erro ao cadastrar fornecedor!',
    //     status: 'error',
    //     position: 'top-right',
    //     isClosable: true,
    //   });
    // })

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
            <Button label='Cadastrar Fornecedor' onPress={() => {
              toast({
                title: 'Função ainda não disponível, entre em contato com os auditores para cadastrar novo fornecedor!',
                status: 'warning',
                position: 'top-right',
                isClosable: true,
              })}} />
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

        <Modal isCentered size={'xl'} title={'Cadastrar Fornecedor'} isOpen={isOpenCompanyRegister} modalOpenAndClose={openAndCloseRegisterCompanyModal}>
          <div className='w-full h-[60vh] overflow-y-scroll pl-2'>
            <div className={CompaniesStyle.ModalContentRow}>
              <span className='text-xl font-semibold'>Dados da Empresa</span>
            </div>
            
            <div className='flex justify-between mb-2'>
              <div className='flex w-auto items-end'>
                <div className='w-96 mr-2'>
                  <Input label='CNPJ' placeholder='CNPJ' value={cnpj} onChange={e => setCnpj(e.target.value)} />
                </div>
              
                <div className={CompaniesStyle.TitleButtonContainer}>
                  <Button label={<AiOutlineSearch />} onPress={() => searchCompanyByCnpj()} />
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
                <Button label='Cancelar' type='second' onPress={openAndCloseRegisterCompanyModal}/>
              </div>

              <div className='w-56'>
                <Button label='Salvar' onPress={() => registerCompanyFunction()}/>
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