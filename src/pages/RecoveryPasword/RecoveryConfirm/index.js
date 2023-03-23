import { useNavigate } from "react-router-dom";

import Button from '../../../components/atoms/Button';
import { RecoveryConfirmStyle } from './style';

const RecoveryConfirm = () => {
  const navigate = useNavigate();

  return (
    <section className={RecoveryConfirmStyle.Container}>
      <div className={RecoveryConfirmStyle.ImageContainer}>
        <img src='./confirmation.png' />
      </div>
      <div className='flex flex-col items-center mt-16'>
        <span className='text-2xl mb-8'>Senha alterada com sucesso!</span>
        <Button label='Continuar' onPress={() => navigate('/')}/>
      </div>

    </section>
  )
}

export default RecoveryConfirm;