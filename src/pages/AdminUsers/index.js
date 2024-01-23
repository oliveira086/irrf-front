import { useEffect, useState, useMemo } from 'react';
import * as chakra from '@chakra-ui/react';
import { useNavigate,
  BrowserRouter as Router,
  useLocation
} from "react-router-dom";

import { AiOutlineSearch } from "react-icons/ai";
import { MdBlockFlipped } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";

import { Player } from '@lottiefiles/react-lottie-player';

import Header from '../../components/molecules/Header';
import Button from "../../components/atoms/Button";
import Input from "../../components/atoms/Input";

import { getAllUsersByCity } from '../../services/userServices';
import { getUserInformations } from "../../services/authServices";
import { unlockUserService } from '../../services/adminServices';

import { AdminUsersStyle } from './style';

const AdminUsers = () => {
  const [userName, setUserName] = useState('');
  const [cityName, setCityName] = useState(''); 
  const [citySearch, setCitySearch] = useState('');

  const [rows, setRows] = useState([]);

  const navigate = useNavigate();
  const query = useQuery();
  const toast = chakra.useToast();

  function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  }

  async function handlerSubmitBlockAndUnblockUser(userId, enabled) {
    await unlockUserService({ user_id: userId, enabled: !enabled }).then(response => {
      toast({
        title: `Usuário ${enabled ? 'Desabilitado': 'Habilitado'}`,
        status: 'success',
        position: 'top-right',
        isClosable: true,
      });
      navigate(0);
    }).catch(error => {
      toast({
        title: `Houve um problema na alteração do usuário`,
        status: 'error',
        position: 'top-right',
        isClosable: true,
      });
    })
  }

  useEffect(() => {
    (async () => {
      await getUserInformations({ currentPage: 1 }).then(response => {
        setUserName(response.body.user_name);
        setCityName(response.body.city_name);
      });

      await getAllUsersByCity({ city_id: query.get("cityId") }).then(response => {
        setRows(response.body);
      });

    })();
  }, []);

  return (
    <section className={AdminUsersStyle.Container}>
      <Header userName={userName} cityName={cityName} />
      <div className={AdminUsersStyle.BodyContainer}>
        <div className={AdminUsersStyle.TitleContainer}>
          <h1 className='text-3xl font-semibold'>Painel Administrativo</h1>
          <div className='w-auto flex justify-between items-end mt-2'>

            <div className='flex items-end'>
              <div className='w-72 mr-4'>
                <Input label='Pesquisar' placeholder='Pesquisar usuário' value={citySearch} onChange={e => setCitySearch(e.target.value)} />
              </div>
              <div className={AdminUsersStyle.TitleButtonContainer}>
                <Button label={<AiOutlineSearch />} onPress={() => {}} isLoading={rows.length > 0 ? false: true } />
              </div>
            </div>

          </div>
        </div>

        <div className={AdminUsersStyle.CityContainer}>

          { rows.length > 0 ?
            <>
              { rows.map(rowsCallback => {
                return (
                  <div className='flex flex-row w-full min-w-36 rounded p-2 mt-2 bg-[#F5F5FA] items-center justify-between'>
                    <div className='flex flex-col w-full'>
                      <span className='text-2xl font-semibold'>{rowsCallback.name}</span>
                    </div>

                    
                    <div className='flex mt-2'>
                      {
                        rowsCallback.enabled == true ?
                          <div className='w-auto mr-2'>
                            <Button label={<MdBlockFlipped color='#fff' size={28}/>} onPress={() => handlerSubmitBlockAndUnblockUser(rowsCallback.id, rowsCallback.enabled) } />
                          </div>
                        :
                        <>
                          <div className='w-auto mr-2'>
                            <Button label={<FaRegCheckCircle color='#fff' size={28} />} onPress={() => handlerSubmitBlockAndUnblockUser(rowsCallback.id, rowsCallback.enabled) } />
                          </div>
                        </>
                      }
                    </div>
                  </div>
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
                <span className='text-[#999] font-semibold'>Não foram encontrados usuários</span>
              </div>
          }

        </div>
      </div>
    </section>
  )
}

export default AdminUsers;