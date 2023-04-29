import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import * as chakra from '@chakra-ui/react';
import Cookies from "universal-cookie";

import Input from '../../components/atoms/Input';
import Button from '../../components/atoms/Button';
import Modal from '../../components/atoms/Modal';

import { loginService } from "../../services/authServices";
import { LoginStyle } from './style';

const Login = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const toast = chakra.useToast();
  const cookies = new Cookies();

  useEffect(() => {
    const bearerToken = cookies.get('@IRRF:bearerToken');
    if(bearerToken !== null) {
      switch(sessionStorage.getItem('role')) {
        case 'ADMIN':
          navigate('/home-admin');
          break
        case 'SECRETARY':
          // navigate('/home-admin')
          break
        case 'CITY MANAGER':
          navigate('/home');
          break
        case 'USER':
          // navigate('/home-admin')
          break
      }
    }
  }, []);

  function openAndCloseModal () {
    setIsOpen(!isOpen);
  }

  async function handleSubmit() {
    try {
      setIsLoading(true);
      const responseToAuth = await loginService({ email: email, phrase: password });

      toast({
        title: 'Login realizado com sucesso!',
        status: 'success',
        position: 'top-right',
        isClosable: true,
      });
      setIsLoading(false);
      
      cookies.set('@IRRF:bearerToken', responseToAuth.body['x-access-token']);
      sessionStorage.setItem('role', responseToAuth?.body?.role);

      switch(responseToAuth?.body?.role){
        case 'ADMIN':
          navigate('/home-admin');
          break
        case 'CITY MANAGER':
          navigate('/home');
          break
        default:
          break
      }

    } catch(error) {
      toast({
        title: 'Usuário ou senha incorretos!',
        status: 'error',
        position: 'top-right',
        isClosable: true,
      });
      setIsLoading(false);
      setIsError(true);
    }
    
  }

  return (
    <section className={LoginStyle.Container}>
      <div className={LoginStyle.ImageContainer}>
      </div>

      <div className={LoginStyle.FormContainer}>
        <div className={LoginStyle.LogoContainer}>
          <img src='./logo-irrf.png' className='w-52'/>
        </div>
        <div className={LoginStyle.TextContainer}>
          <h1 className={LoginStyle.TitleContainer}>Bem vindo(a)!</h1>
          <span className='text-[#75757F]'>Para entrar, coloque as informações inseridas no cadastro.</span>
        </div>

        <div className={LoginStyle.Form}>
        <Modal isCentered title={'Qual sua função no município?'} isOpen={isOpen} modalOpenAndClose={openAndCloseModal}>
          <div className='flex flex-col w-auto h-36 justify-around '>
            <div>
              <Button label={'Financeiro'} onPress={() => {navigate('/cadastro-financeiro')}} /> 
            </div>
            <div>
              <Button label={'Tributário'} onPress={() => {navigate('/cadastro-fiscal')}}/>
            </div>
          </div>
        </Modal>
          <div className='w-96 h-auto mb-4'>
            <Input label='E-mail' placeholder='Email' value={email} isError={isError} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className='w-96 h-auto'>
            <Input label='Senha' placeholder='Senha' type='password' value={password} isError={isError} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className='flex w-96 justify-end mt-2 mb-8'>
            <span className='underline text-[#5064B2] cursor-pointer' onClick={() => {navigate('/recuperar-senha')}}>Esqueceu a senha?</span>
          </div>
          <div className='w-80 h-auto'>
            <Button label={'Entrar'} onPress={() => handleSubmit()} isLoading={isLoading} />
          </div>
          <div className='flex w-96 justify-center mt-4'>
            <span onClick={() => openAndCloseModal()}>Ainda não tem cadastro? <b className='text-[#5064B2] cursor-pointer' >Cadastre-se</b></span>
          </div>    
        </div>
      </div>
    </section>
  )
}

export default Login;