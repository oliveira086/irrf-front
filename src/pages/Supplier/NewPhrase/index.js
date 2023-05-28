import { useState } from 'react';
import { BiChevronLeft } from 'react-icons/bi';
import { useNavigate } from "react-router-dom";
import * as chakra from '@chakra-ui/react';
import { FiLock, FiKey } from 'react-icons/fi';

import Input from '../../../components/atoms/Input';
import Button from '../../../components/atoms/Button';
import { updatePhraseCompany } from '../../../services/authServices';

import { SupplierNewPhraseStyle } from './style';

const SupplierNewPhrase = () => {
  const navigate = useNavigate();
  const toast = chakra.useToast();

  const email = sessionStorage.getItem('company-email');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async () => {
    const objectToSend = {
      email: email,
      token: token,
      phrase: password
    };

    if(password == confirmPassword) {
      const resposeToUpdatePhrase = await updatePhraseCompany(objectToSend);

      if(resposeToUpdatePhrase.message == 'Password added') {
        toast({
          title: 'Senha adicionada!',
          status: 'success',
          position: 'top-right',
          isClosable: true,
        });
      } else {
        toast({
          title: 'Houve um erro, tente novamente mais tarde',
          status: 'error',
          position: 'top-right',
          isClosable: true,
        });
      }
      
    } else {
      toast({
        title: 'As senhas não são iguais!',
        status: 'error',
        position: 'top-right',
        isClosable: true,
      });
    }
  }

  return (
    <section className={SupplierNewPhraseStyle.Container}>
      <div className='flex w-1/3 items-center mb-8'>
        <BiChevronLeft className='cursor-pointer' size={44} onClick={() => navigate(-1)}/>
        <h1 className='text-3xl'>Nova senha</h1>
      </div>
      <div className='w-1/3'><span>Enviamos um token para o seu email, insira esse token para conseguir criar sua senha. Caso não encontre, por favor, verifique a caixa de spam.</span></div>
      <div className='w-1/3 mt-4 space-y-2'>

        <Input label='Token' value={token} onChange={e => setToken(e.target.value)} placeholder='Token' type='icon' icon={<FiKey size={20} color='gray.300' />} />
        <Input label='Nova senha'  value={password} onChange={e => setPassword(e.target.value)} placeholder='Nova senha' type='password' icon={<FiLock size={20} color='gray.300' />} />
        <Input label='Confirme a nova senha' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder='Confirme a nova senha' type='password' icon={<FiLock size={20} color='gray.300' />} />


      </div>
      <div className='flex w-1/3 mt-16 justify-between'>
        <div className='w-72'>
          <Button label={'Cancelar'} type='second' onPress={() => navigate(-1)}/>
        </div>
        <div className='w-72'>
          <Button label={'Salvar'} onPress={() => handleSubmit()} />
        </div>
      </div>
    </section>
  )
};

export default SupplierNewPhrase;