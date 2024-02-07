import { useEffect, useState, useMemo  } from 'react';
import {
  BrowserRouter as Router,
  useLocation,
  useNavigate 
} from "react-router-dom";
import * as chakra from '@chakra-ui/react';

import { AiOutlineSearch, AiOutlinePlus } from "react-icons/ai";
import { MdLocationCity } from "react-icons/md";
import { FiEye, FiX } from "react-icons/fi";
import { TbEdit } from "react-icons/tb";

import { Player } from '@lottiefiles/react-lottie-player';

import Header from '../../components/molecules/Header';
import Button from "../../components/atoms/Button";
import Input from "../../components/atoms/Input";
import Modal from "../../components/atoms/Modal";

import { formatCpfOrCnpj } from '../../utils/formatCpfAndCnpj';

import { getUserInformations } from "../../services/authServices";
import { getAllServicesByCity, updateIssService } from "../../services/servicesAndProductServices";
import { getComputersByCity, registerComputer } from "../../services/adminServices";

import { AdminAliquotsStyle } from './style';


const AdminAliquots = () => {

  const [userName, setUserName] = useState('');
  const [cityName, setCityName] = useState(''); 
  const [isOpen, setIsOpen] = useState(false);
  const [citySearch, setCitySearch] = useState('');

  const [label, setLabel] = useState('');
  const [aliquot, setAliquot] = useState('');
  const [itemId, setItemId] = useState('');
  const [incidence, setIncidence] = useState(false);

  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const query = useQuery();
  const toast = chakra.useToast();

  function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  }

  async function openAndCloseAliquotEdit(data) {
    console.log(data);
    setLabel(data?.['iss_services_products_services_id.label']);
    setAliquot(data?.value);
    setItemId(data?.id);
    setIncidence(data?.incidence)

    setIsOpen(!isOpen);
  }

  async function handlerSubmitEdit() {

    const object = {
      id: itemId,
      value: aliquot,
      incidence: incidence
    }

    updateIssService(object).then(response => {
      toast({
        title: 'Item editado!',
        status: 'success',
        position: 'top-right',
        isClosable: true,
      });
      navigate(0);
    }).catch(error=> {
      toast({
        title: 'Houve um problema ao editar esse item!',
        status: 'error',
        position: 'top-right',
        isClosable: true,
      });
      console.log(error)
    })
  }

  useEffect(() => {
    (async () => {
      await getUserInformations({ currentPage: 1 }).then(response => {
        setUserName(response.body.user_name);
        setCityName(response.body.city_name);
      });

      await getAllServicesByCity({ city_id: query.get("cityId") }).then(response => {
        setRows(response.body);
      })
    })();
  }, []);

  return (
    <section className={ AdminAliquotsStyle.Container }>
      <Header userName={userName} cityName={cityName} />
      <div className={AdminAliquotsStyle.BodyContainer}>
        <div className={AdminAliquotsStyle.TitleContainer}>
          <div className='flex w-full justify-between'>
            <h1 className='text-3xl font-semibold'>Aliquotas</h1>
            {/* <h2 className='text-2xl font-medium text-[#2F4ECC]'>{cityName}</h2> */}
          </div>
          <div className='w-auto flex justify-between items-end mt-2'>

            <div className='flex items-end'>
              <div className='w-72 mr-4'>
                <Input label='Pesquisar' placeholder='Pesquisar Item' value={citySearch} onChange={e => setCitySearch(e.target.value)} />
              </div>
              <div className={AdminAliquotsStyle.TitleButtonContainer}>
                <Button label={<AiOutlineSearch />} onPress={() => {}} isLoading={rows.length > 0 ? false: true } />
              </div>
            </div>

            <div className='w-56'>
              <Button label={<><AiOutlinePlus className='mr-4'/><span>Adicionar Prefeitura</span></>} onPress={() => {}} />
            </div>
          </div>
        </div>

        <div className='w-full border border-[#ededed] rounded mt-2 overflow-x-scroll'>
          <chakra.Skeleton className="w-full h-[60vh] mt-4" isLoaded={rows.length > 0 ? true : false}>
            <chakra.Table variant='simple' size='lg'>
              <chakra.Thead>
                <chakra.Tr>
                  <chakra.Th>Nome</chakra.Th>
                  <chakra.Th>Incidente</chakra.Th>
                  <chakra.Th>Aliquota</chakra.Th>
                  <chakra.Th></chakra.Th>
                </chakra.Tr>
              </chakra.Thead>

              <chakra.Tbody>
                {
                  rows.length > 0 ?
                    <>
                      {rows.map(rowsCallback => {
                        return (
                          <chakra.Tr>
                            <chakra.Td>{rowsCallback?.['iss_services_products_services_id.label']}</chakra.Td>
                            <chakra.Td>{<chakra.Switch className='mr-4' size='md' isChecked={rowsCallback?.incidence} />}</chakra.Td>
                            <chakra.Td>{rowsCallback.value} %</chakra.Td>
                            <chakra.Td><TbEdit size={28} className='cursor-pointer' onClick={() => openAndCloseAliquotEdit(rowsCallback)}/></chakra.Td>
                          </chakra.Tr>
                        )
                      })}
                    </>
                  :
                  <div className='flex flex-col w-full h-full items-center justify-center'>
                    <Player
                      src='https://assets8.lottiefiles.com/private_files/lf30_fn9xcfqg.json'
                      className="player"
                      loop
                      autoplay
                    />
                    <span className='text-[#999] font-semibold'>Não foram encontrados registros</span>
                  </div>
                }
              </chakra.Tbody>
            </chakra.Table>
          </chakra.Skeleton>

        </div>

        <Modal isCentered size={'xl'} title={'Editar Aliquota'} isOpen={isOpen} modalOpenAndClose={openAndCloseAliquotEdit} >
          <div className='w-full h-[60vh] pl-2'>
            <div className={AdminAliquotsStyle.ModalContentRow}>
              <span className='text-xl font-semibold'>Dados da aliquota</span>
            </div>
            
            <div className='flex justify-between mb-2'>
              <div className='flex w-full justify-between'>
                <div className='w-5/12'>
                  <Input label='Nome' placeholder='Nome' value={label} onChange={e => setLabel(e.target.value)} />
                </div>
                <div className='w-5/12'>
                  <Input label='Aliquota' placeholder='Aliquota' value={aliquot} onChange={e => setAliquot(e.target.value)} />
                </div>
                
              </div>
            </div>

            <div className='flex justify-between mb-2'>
              
            </div>

            <div>
              <span className='text-xl'>Informações Complementares</span>
            </div>

            <div className='mb-4 h-80'>
              <div>
                <chakra.Switch isChecked={incidence} onChange={(e) => {setIncidence(!incidence)}} />
                <span className='ml-2'>Incidente</span>
              </div>
            </div>

            <div className='flex pl-20 pr-20 justify-between mt-6 mb-6'>
              <div className='w-56'>
                <Button label='Cancelar' type='second' onPress={() => setIsOpen(false)}/>
              </div>

              <div className='w-56'>
                <Button label='Salvar' onPress={() => handlerSubmitEdit()}/>
              </div>
              
            </div>
          </div>
        </Modal>

      </div>
    </section>
  )
}

export default AdminAliquots