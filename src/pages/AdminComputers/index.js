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
import { getComputersByCity, registerComputer } from "../../services/adminServices";

import { AdminComputersStyle } from './style';

const AdminComputers = () => {
  const [userName, setUserName] = useState('');
  const [cityName, setCityName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const [cnpj, setCnpj] = useState('');
  const [label, setLabel] = useState('');
  const [isAutarchy, setIsAutarchy] = useState(false);
  
  const [citySearch, setCitySearch] = useState('');
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const query = useQuery();
  const toast = chakra.useToast();

  function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  }

  async function openAndCloseCreateComputer() {
    setIsOpen(!isOpen);
  }

  async function handlerSubmit () {
    const object = {
      cnpj: cnpj,
      city_id: query.get("cityId"),
      label: label,
      is_autarchy: isAutarchy
    }

    await registerComputer(object).then(response => {
      toast({
        title: 'Ordenador Cadastrado!',
        status: 'success',
        position: 'top-right',
        isClosable: true,
      });
      setIsOpen(false);
      navigate(0);
    }).catch(error => {
      toast({
        title: 'Houve um problema ao cadastar esse ordenador!',
        status: 'error',
        position: 'top-right',
        isClosable: true,
      });
    });
  }

  useEffect(() => {
    (async () => {
      await getUserInformations({ currentPage: 1 }).then(response => {
        setUserName(response.body.user_name);
        setCityName(response.body.city_name);
      });

      await getComputersByCity({ city_id: query.get("cityId") }).then(response => {
        setRows(response.body);
      });

    })();
  }, [])

  return (
    <section className={ AdminComputersStyle.Container }>
      <Header userName={userName} cityName={cityName} />
      <div className={AdminComputersStyle.BodyContainer}>
        <div className={AdminComputersStyle.TitleContainer}>
          <div className='flex w-full justify-between'>
            <h1 className='text-3xl font-semibold'>Ordenadores</h1>
            <h2 className='text-2xl font-medium text-[#2F4ECC]'>{cityName}</h2>
          </div>
          <div className='w-auto flex justify-between items-end mt-2'>

            <div className='flex items-end'>
              <div className='w-72 mr-4'>
                <Input label='Pesquisar' placeholder='Pesquisar Ordenador' value={citySearch} onChange={e => setCitySearch(e.target.value)} />
              </div>
              <div className={AdminComputersStyle.TitleButtonContainer}>
                <Button label={<AiOutlineSearch />} onPress={() => {}} isLoading={rows.length > 0 ? false: true } />
              </div>
            </div>

            <div className='w-60'>
              <Button label={<><AiOutlinePlus className='mr-4'/><span>Adicionar Ordenador</span></>} onPress={() => setIsOpen(true)} />
            </div>
          </div>
        </div>

        <div className='w-full border border-[#ededed] rounded mt-2 overflow-x-scroll'>
          <chakra.Skeleton className="w-full h-[60vh] mt-4" isLoaded={rows.length > 0 ? true : false}>
            <chakra.Table variant='simple' size='lg'>
              <chakra.Thead>
                <chakra.Tr>
                  <chakra.Th>Ordenador</chakra.Th>
                  <chakra.Th>CNPJ</chakra.Th>
                  <chakra.Th>R100 Enviado</chakra.Th>
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
                            <chakra.Td>{rowsCallback.label}</chakra.Td>
                            <chakra.Td>{formatCpfOrCnpj(rowsCallback.cnpj)}</chakra.Td>
                            <chakra.Td>{<chakra.Switch className='mr-4' size='md' isChecked={rowsCallback.reinf_registed} />}</chakra.Td>
                            <chakra.Td><TbEdit size={28} className='cursor-pointer' onClick={() => openAndCloseEditSupplier(rowsCallback)}/></chakra.Td>
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

        <Modal isCentered size={'xl'} title={'Cadastro de Ordenador'} isOpen={isOpen} modalOpenAndClose={openAndCloseCreateComputer} >
          <div className='w-full h-[60vh] pl-2'>
            <div className={AdminComputersStyle.ModalContentRow}>
              <span className='text-xl font-semibold'>Dados do Ordenador</span>
            </div>
            
            <div className='flex justify-between mb-2'>
              <div className='flex w-full justify-between'>
                <div className='w-5/12'>
                  <Input label='Nome' placeholder='Nome' value={label} onChange={e => setLabel(e.target.value)} />
                </div>
                <div className='w-96 mr-2'>
                  <Input label='CNPJ' placeholder='CNPJ' value={cnpj} onChange={e => setCnpj(e.target.value)} />
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
                <chakra.Switch isChecked={isAutarchy} onChange={(e) => {setIsAutarchy(!isAutarchy)}} />
                <span className='ml-2'>Autarquia</span>
              </div>
            </div>

            <div className='flex pl-20 pr-20 justify-between mt-6 mb-6'>
              <div className='w-56'>
                <Button label='Cancelar' type='second' onPress={() => setIsOpen(false)}/>
              </div>

              <div className='w-56'>
                <Button label='Salvar' onPress={() => handlerSubmit()}/>
              </div>
              
            </div>
          </div>
        </Modal>
      </div>
    </section>
  )
}

export default AdminComputers