import { useNavigate } from "react-router-dom";

import Button from '../../../components/atoms/Button';
import { RegisterConfirmStyle } from './style';

const RegisterConfirm = () => {
  const navigate = useNavigate();

  return (
    <section className={RegisterConfirmStyle.Container}>
      <div className={RegisterConfirmStyle.ImageContainer}>
        <img src='./confirmation.png' />
      </div>
      <div className='flex flex-col items-center mt-16'>
        <span className='text-2xl mb-8'>Cadastro realizado com sucesso!</span>
        <Button label='Continuar' onPress={() => navigate('/')}/>
      </div>
    </section>
  )
}

export default RegisterConfirm;