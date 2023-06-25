import { useState } from 'react';
import { BiChevronLeft } from 'react-icons/bi';
import { useNavigate } from "react-router-dom";
import * as chakra from '@chakra-ui/react';
import Cookies from "universal-cookie";
import { FiMail } from 'react-icons/fi';

import Input from '../../../components/atoms/Input';
import Button from '../../../components/atoms/Button';
import { loginCompany } from '../../../services/authServices';

import { SupplierTokenStyle } from './style';

const SupplierRequestToken = () => {
  const navigate = useNavigate();
  const toast = chakra.useToast();

  const [email, setEmail] = useState('');
  const [phrase, setPhrase] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  

  const handleSubmit = async () => {

    try {
      setIsLoading(true);
      const responseToAuth = await loginCompany({ email: email, phrase: phrase });

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
        
        if(responseToAuth == 401) {
          toast({
            title: 'Seu email já possui senha, tente fazer o login!',
            status: 'error',
            position: 'top-right',
            isClosable: true,
          });

          navigate('/fornecedor');
        }

        setIsLoading(false);
        
        sessionStorage.setItem('role', responseToAuth?.body?.role);
  
        switch(responseToAuth?.body?.role){
          case 'COMPANY':
            navigate('/fornecedor/home-fornecedor');
            break
          default:
            break
        }
      }

    } catch(error) {
      setIsLoading(false);
    }

  }

  return (
    <section className={SupplierTokenStyle.Container}>
      <div className='flex w-1/3 items-center mb-8'>
        <BiChevronLeft className='cursor-pointer' size={44} onClick={() => navigate(-1)}/>
        <h1 className='text-3xl'>Nova senha</h1>
      </div>
      <div className='w-1/3'><span>Digite seu email para podemos enviar um token de confirmação.</span></div>
      <div className='w-1/3 mt-4 space-y-2'>
        <Input label='Email' value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' type='icon' icon={<FiMail size={20} color='gray.300' />} />
      </div>
      <div className='flex w-1/3 mt-16 justify-between'>
        <div className='w-72'>
          <Button label={'Cancelar'} type='second' onPress={() => navigate(-1)}/>
        </div>
        <div className='w-72'>
          <Button label={'Confirmar'} onPress={() => handleSubmit()} isLoading={isLoading} />
        </div>
      </div>
    </section>
  )
};

export default SupplierRequestToken;