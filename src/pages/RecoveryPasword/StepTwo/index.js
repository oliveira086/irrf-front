import { BiChevronLeft } from 'react-icons/bi';
import { useNavigate } from "react-router-dom";

import Input from '../../../components/atoms/Input';
import Button from '../../../components/atoms/Button';

import { InsertTokenStyle } from './style';

const InsertToken = () => {
  const navigate = useNavigate();
  return (
    <section className={InsertTokenStyle.Container}>
      <div className='flex w-1/3 items-center mb-8'>
        <BiChevronLeft className='cursor-pointer' size={44} onClick={() => navigate(-1)}/>
        <h1 className='text-3xl'>Inserir Token</h1>
      </div>
      <div className='w-1/3'><span>Enviamos um token para o seu email, insira esse token para conseguir alterar sua senha. Caso não encontre, por favor, verifique a caixa de spam.</span></div>
      <div className='w-1/3 mt-4'>
        <Input label='Token' placeholder='Token' type='icon' />
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
};

export default InsertToken;