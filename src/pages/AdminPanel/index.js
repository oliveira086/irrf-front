import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import { AiOutlineSearch, AiOutlinePlus } from "react-icons/ai";
import { MdAttachMoney, MdLocationCity } from "react-icons/md";
import { BiStoreAlt } from "react-icons/bi";
import { GoGraph } from "react-icons/go";

import { Player } from '@lottiefiles/react-lottie-player';

import Header from '../../components/molecules/Header';
import Button from "../../components/atoms/Button";
import Input from "../../components/atoms/Input";

import { getUserInformations } from "../../services/authServices";
import { getAllCitiesRegisted } from "../../services/adminServices";

import { AdminPanelStyle } from './style';

const AdminPanel = () => {
  const [userName, setUserName] = useState('');
  const [cityName, setCityName] = useState(''); 
  
  const [citySearch, setCitySearch] = useState('');

  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await getUserInformations({ currentPage: 1 }).then(response => {
        setUserName(response.body.user_name);
        setCityName(response.body.city_name);
      });

      await getAllCitiesRegisted().then(response => {
        setRows(response.body);
      })
    })();
  }, []);

  return (
    <section className={AdminPanelStyle.Container}>
      <Header userName={userName} cityName={cityName} />
      <div className={AdminPanelStyle.BodyContainer}>
        <div className={AdminPanelStyle.TitleContainer}>
          <h1 className='text-3xl font-semibold'>Painel Administrativo</h1>
          <div className='w-auto flex justify-between items-end mt-2'>

            <div className='flex items-end'>
              <div className='w-72 mr-4'>
                <Input label='Pesquisar' placeholder='Pesquisar prefeitura' value={citySearch} onChange={e => setCitySearch(e.target.value)} />
              </div>
              <div className={AdminPanelStyle.TitleButtonContainer}>
                <Button label={<AiOutlineSearch />} onPress={() => {}} isLoading={rows.length > 0 ? false: true } />
              </div>
            </div>

            <div className='w-56'>
              <Button label={<><AiOutlinePlus className='mr-4'/><span>Adicionar Prefeitura</span></>} onPress={() => {}} />
            </div>
          </div>
        </div>

        <div className={AdminPanelStyle.CityContainer}>

          {rows.length > 0 ?
            <>
              {rows.map(rowsCallback => {
                return (
                  <div className='flex flex-row w-full min-w-36 rounded p-2 mt-2 bg-[#F5F5FA] items-center justify-between'>
                    <div className='flex flex-col w-full'>
                      <span className='text-2xl font-semibold'>{rowsCallback.label}</span>
                    </div>
                    <div>
                      
                    </div>
                    <div className='flex mt-2'>
                      <div className='w-auto mr-2'>
                        <Button label={<BiStoreAlt color='#fff' size={28}/>} onPress={() => navigate(`/painel-fornecedores?cityId=${rowsCallback.id}`)} />
                      </div>

                      <div className='w-auto mr-2'>
                        <Button label={<MdAttachMoney color='#fff' size={28} />} onPress={() => navigate(`/painel-pagamentos?cityId=${rowsCallback.id}`)} />
                      </div>

                      <div className='w-auto mr-2'>
                        <Button label={<MdLocationCity color='#fff' size={28}/>} onPress={() => navigate(`/painel-ordenadores?cityId=${rowsCallback.id}`) } />
                      </div>

                      <div className='w-auto'>
                        <Button label={<GoGraph color='#fff' size={28}/>} onPress={() => navigate(`/painel-aliquotas?cityId=${rowsCallback.id}`) } />
                      </div>
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
                <span className='text-[#999] font-semibold'>Não foram encontrados registros</span>
              </div>
          }

        </div>
      </div>
    </section>
  )
}

export default AdminPanel;