import { BiChevronLeft } from 'react-icons/bi';
import { useNavigate } from "react-router-dom";

import Button from '../../../components/atoms/Button';
import Input from '../../../components/atoms/Input';
import { RecoveryStyle } from '../StepOne/style';

const RecoveryPassword = () => {
  const navigate = useNavigate();

  return (
    <section className={RecoveryStyle.Container}>
      <div className='flex w-1/3 items-center mb-8'>
        <BiChevronLeft className='cursor-pointer' size={44} onClick={() => navigate(-1)}/>
        <h1 className='text-3xl'>Recuperar senha</h1>
      </div>
      <div className='w-1/3'><span>Enviaremos um token para o email cadastrado para que possa alterar sua senha. Por favor, insira seu email.</span></div>
      <div className='w-1/3 mt-4'>
        <Input label='Email' placeholder='Email' />
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

export default RecoveryPassword;