import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { BiHomeSmile, BiChevronDown } from "react-icons/bi";
import { BsImageFill } from "react-icons/bs";
import { TbHeartRateMonitor } from 'react-icons/tb';
import { MdAttachMoney, MdExitToApp, MdStore } from 'react-icons/md';
import { HiOutlineUserGroup } from 'react-icons/hi';
import * as chakra from '@chakra-ui/react';

import logo from '../../assets/images/logo-irrf.png'

const Header = ({ userName, cityName }) => {
  const uri = window.location.pathname;
  const navigate = useNavigate();

  const [menuVisible, setMenuVisible] = useState(false);

  function logout() {
    const cookies = new Cookies();
    cookies.set('@IRRF:bearerToken', null);
    sessionStorage.setItem('role', null);
    window.location.href = '/'
  }

  function ButtonByRole (role) {
    switch(role) {
      case 'ADMIN':
        return (
          <div className='flex'>
            <button onClick={() => navigate('/home-admin') } className={uri.indexOf('home') > -1 ? style.ButtonSelected : style.Button}>
              <BiHomeSmile color='#2F4ECC' size={24} className="stroke-[#2F4ECC]" />
              <span className="mt-2 ">Home</span>
            </button>
            <button onClick={() => navigate('/pre-pagamentos') } className={uri.indexOf('pre-pagamento') > -1 ? style.ButtonSelected : style.Button}>
              <BsImageFill color='#2F4ECC' size={24} className="stroke-[#2F4ECC]" />
              <span className="mt-2 ">Pré Pagamentos</span>
            </button>
            <button onClick={() => navigate('/painel-administrativo') } className={uri.indexOf('/painel') > -1 ? style.ButtonSelected : style.Button}> 
              <TbHeartRateMonitor color='#2F4ECC' size={24} className="stroke-[#2F4ECC]" />
              <span className="mt-2 ">Painel Administrativo</span>
            </button>
            <button  onClick={() => navigate('/pagamentos') } className={uri.indexOf('/pagamentos') > -1 ? style.ButtonSelected : style.Button} >
              <MdAttachMoney color='#2F4ECC' size={24} className="stroke-[#2F4ECC]" />
              <span className="mt-2 ">Pagamentos</span>
            </button>
          </div>
        )
        break
      case 'CITY MANAGER':
        return (
          <div className='flex'>
            <button onClick={() => navigate('/home') } className={uri.indexOf('home') > -1 ? style.ButtonSelected : style.Button}>
              <BiHomeSmile color='#2F4ECC' size={24} className="stroke-[#2F4ECC]" />
              <span className="mt-2 ">Home</span>
            </button>
            <button onClick={() => navigate('/fornecedores') } className={uri.indexOf('fornecedores') > -1 ? style.ButtonSelected : style.Button}>
              <MdStore color='#2F4ECC' size={24} className="stroke-[#2F4ECC]" />
              <span className="mt-2 ">Fornecedores</span>
            </button>
          </div>
        )
        break
      case 'MAIN SECRETARY':
        return (
          <div className='flex'>
            <button onClick={() => navigate('/painel-fiscal') } className={uri.indexOf('/painel-fiscal') > -1 ? style.ButtonSelected : style.Button}>
              <BiHomeSmile color='#2F4ECC' size={24} className="stroke-[#2F4ECC]" />
              <span className="mt-2 ">Home</span>
            </button>
          </div>
        )
        break
        
      default:
        return (
          <div className='flex'>
            <button className={style.Button}>
              <BiHomeSmile color='#2F4ECC' size={24} className="stroke-[#2F4ECC]" />
              <span className="mt-2 ">Home</span>
            </button>
          </div>
        )
        break
    }
  }

  return (
    <div className={style.Container}>
      <div className={style.LogoContainer}>
        <img src={logo} className='w-36 cursor-pointer'/>
      </div>
      <div className={style.ButtonsContainer}>
        {ButtonByRole(sessionStorage.getItem('role')) }
      </div>
      
      <chakra.Skeleton className={style.UserContainer} isLoaded={userName.length > 0 ? true : false}>
        <div className={style.UserContainer}>
          <div className={style.UserTextContainer}>
            <span className="text-xl font-semibold">{userName}</span>
            <span>{cityName}</span>
          </div>
          <div className={style.UserAvatarContainer}>
            {menuVisible == true ? 
              <div onClick={() => logout()} className="absolute mt-28 mr-20 w-40 rounded p-2 border border-[#BB0000] bg-[#fff] cursor-pointer">
                <div className="flex items-center">
                  <MdExitToApp size={24} className="mr-4"/>
                  <span>Sair</span>
                </div>
              </div>
              :
              <></>
            }
            <chakra.Avatar />
            <div className="">
              <BiChevronDown size={24} className="cursor-pointer" onClick={() => setMenuVisible(!menuVisible)}/>
            </div>
          </div>
        </div>
      </chakra.Skeleton>
    </div>
  )
}

const style = {
  Container: 'flex w-full h-auto bg-white pl-20 pr-20 border-b-2 border-[#D9D9D9] justify-between',
  LogoContainer: 'flex w-48 items-center justify-start',
  ButtonsContainer: 'w-auto h-auto ml-36',
  Button: 'flex flex-col w-auto h-full pt-4 pb-2 pl-4 pr-4 items-center text-[#2F4ECC] hover:bg-[#F0F3FF] mr-4',
  ButtonSelected: 'flex flex-col w-auto h-full bg-[#F0F3FF] pt-4 pb-2 pl-4 pr-4 items-center border-b-2 border-[#2F4ECC] font-semibold text-[#2F4ECC] mr-4',
  UserContainer: 'flex w-auto h-auto min-w-[16vw]',
  UserTextContainer: 'flex flex-col w-auto h-auto text-right justify-center',
  UserAvatarContainer: 'flex w-24 h-full items-center justify-around ml-2'
}

export default Header