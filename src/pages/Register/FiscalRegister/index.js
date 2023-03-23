import { BiChevronLeft } from 'react-icons/bi';
import { useNavigate } from "react-router-dom";

import Input from '../../../components/atoms/Input';
import Select from "../../../components/atoms/Select";
import Button from '../../../components/atoms/Button';

import { FiscalRegisterStyle } from './style'

const FiscalRegister = () => {
  const navigate = useNavigate();
  return (
    <section className={FiscalRegisterStyle.Container}>
      <div className='flex w-1/3 items-center mb-8'>
        <BiChevronLeft className='cursor-pointer' size={44} onClick={() => navigate(-1)}/>
        <h1 className='text-3xl'>Cadastro</h1>
      </div>
      <div className='w-1/3 h-auto flex justify-between'>
        <div className='w-72 h-auto mt-4'>
          <Select placeholder="Estado"
            options={[]}/>
        </div>
        <div className='w-72 mt-4'>
          <Select placeholder="Cidade"
            options={[]}/>
        </div>
      </div>
      <div className='w-1/3 flex justify-between'>
        <Select placeholder="Ordenadores" options={[]}/>
      </div>
      <div className='w-1/3 mt-4'>
        <Input label='Telefone' placeholder='Telefone' />
      </div>
      <div className='w-1/3 flex justify-between'>
        <div className='w-72 mt-4'>
          <Input label='Email' placeholder='Email' />
        </div>
        <div className='w-72 mt-4'>
          <Input label='Nome Completo' placeholder='Nome Completo' />
        </div>
      </div>
      <div className='w-1/3 mt-4'>
        <Input label='Matrícula' placeholder='Matrícula' />
      </div>
      <div className='w-1/3 mt-4'>
        <Input label='Cargo' placeholder='Cargo' />
      </div>
      <div className='w-1/3 mt-4'>
        <Input label='Senha' placeholder='Senha' type='password' />
      </div>
      <div className='w-1/3 mt-4'>
        <Input label='Repetir senha' placeholder='Repetir senha' type='password' />
      </div>

      <div className='flex w-1/3 justify-between mt-16'>
        <div className='w-72'><Button label='Cancelar' type='second' onPress={() => {navigate(-1)}}/></div>
        <div className='w-72'><Button label='Cadastrar' /></div>
      </div>
    </section>
  )
}

export default FiscalRegister;