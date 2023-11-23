import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import * as chakra from '@chakra-ui/react';
import Cookies from "universal-cookie";

import Input from '../../components/atoms/Input';
import Button from '../../components/atoms/Button';
import Modal from '../../components/atoms/Modal';

import { loginCompany } from "../../services/authServices";
import { SupplierStyle } from './style';

const Supplier = () => {
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
        case 'COMPANY':
          navigate('/home-admin');
          break
        default:
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
      const responseToAuth = await loginCompany({ email: email, phrase: password });
      

      if(responseToAuth.body['x-access-token'] !== null || responseToAuth.body['x-access-token'] !== undefined) {
        cookies.set('@IRRF:bearerToken', responseToAuth.body['x-access-token']);
        sessionStorage.setItem('role', responseToAuth?.body?.role);
      }

      if(responseToAuth?.message == 'Token inserted') {
        toast({
          title: 'Crie uma nova senha!',
          status: 'success',
          position: 'top-right',
          isClosable: true,
        });

        sessionStorage.setItem('company-email', email);
        navigate('/fornecedor/nova-senha');
      } else {
        setIsLoading(false);
  
        switch(responseToAuth?.body?.role){
          case 'COMPANY':
            navigate('/fornecedor/home-fornecedor');
            break
          default:
            break
        }
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
    <section className={SupplierStyle.Container}>
      <div className={SupplierStyle.ImageContainer}>
      </div>

      <div className={SupplierStyle.FormContainer}>
        <div className={SupplierStyle.LogoContainer}>
          <img src='./logo-irrf.png' className='w-56'/>
        </div>
        <div className={SupplierStyle.TextContainer}>
          <h1 className={SupplierStyle.TitleContainer}>Bem vindo fornecedor!</h1>
          <span className='text-[#75757F]'>Para entrar, coloque as informações inseridas no cadastro.</span>
        </div>

        <div className={SupplierStyle.Form}>
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
            {/* <span className='underline text-[#5064B2] cursor-pointer' onClick={() => {navigate('/recuperar-senha')}}>Esqueceu a senha?</span> */}
          </div>
          <div className='w-80 h-auto'>
            <Button label={'Entrar'} onPress={() => handleSubmit()} isLoading={isLoading} />
          </div>
          <div className='flex w-96 justify-center mt-4'>
            <span onClick={() => navigate('/fornecedor/token')}>Primeiro Acesso? <b className='text-[#5064B2] cursor-pointer' >Clique aqui</b></span>
          </div>    
        </div>
      </div>
    </section>
  )
}

export default Supplier;