import { BiChevronLeft } from 'react-icons/bi';
import { useNavigate } from "react-router-dom";

import Input from '../../../components/atoms/Input';
import Button from '../../../components/atoms/Button';

import { ChangePasswordStyle } from './style';
const ChangePassword = () => {
  const navigate = useNavigate();

  return (
    <section className={ChangePasswordStyle.Container}>
      <div className='flex w-1/3 items-center mb-8'>
        <BiChevronLeft className='cursor-pointer' size={44} onClick={() => navigate(-1)}/>
        <h1 className='text-3xl'>Alterar senha</h1>
      </div>
      <div className='w-1/3'><span>Prontinho! Agora basta inserir sua nova senha e finalizar.</span></div>
      <div className='w-1/3 mt-4'>
        <Input label='Senha' placeholder='Senha' />
      </div>
      <div className='w-1/3 mt-4'>
        <Input label='Repetir senha' placeholder='repetir senha' />
      </div>
      <div className='flex w-1/3 mt-16 justify-between'>
        <div className='w-72'>
          <Button label={'Cancelar'} type='second' onPress={() => navigate(-1)}/>
        </div>
        <div className='w-72'>
          <Button label={'Entrar'} />
        </div>
      </div>
    </section>
  )
}

export default ChangePassword;