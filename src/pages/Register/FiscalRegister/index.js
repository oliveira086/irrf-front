import { useEffect, useState } from 'react';
import * as chakra from '@chakra-ui/react';
import { BiChevronLeft } from 'react-icons/bi';
import { useNavigate } from "react-router-dom";

import Input from '../../../components/atoms/Input';
import Select from "../../../components/atoms/Select";
import Button from '../../../components/atoms/Button';

import { getUfService, getCityService, getComputersService, registerService } from '../../../services/authServices';

import { FiscalRegisterStyle } from './style'

const FiscalRegister = () => {

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [registration, setRegistration] = useState('');
  const [phrase, setPhrase] = useState('');
  const [confirmPhrase, setConfirmPhrase] = useState('');
  const [ufOptions, setUfOptions] = useState([]);
  const [optionSelected, setOptionSelected] = useState('');
  const [cityOptionSelected, setCityOptionSelected] = useState('');
  const [cities, setCities] = useState([]);
  const [computersOptions, setComputersOptions] = useState([]);
  const [computer, setComputer] = useState('');
  const [office, setOffice] = useState('');

  const navigate = useNavigate();

  const toast = chakra.useToast();

  const getCityInformations = async (item) => {
    let response = await getCityService({ uf_id: item.id });
    setCities(response.body);
  };

  const getComputerInformations = async (item) => {
    let response = await getComputersService({ city_id: item.id});
    setComputersOptions(response.body);
  }

  const handlerSubmit = async () => {

    if(phrase == confirmPhrase) {
      let object = {
        "name": name,
        "registration": registration,
        "phone": phone,
        "email": email,
        "phrase": phrase,
        "city_id": cityOptionSelected.id,
        "secretary": computer.label,
        "office": office,
        "is_secretary": true
      }
      
      let response = await registerService(object);

      if(response == 500 || response == 401 || response == 503) {
        toast.warn('Houve um problema no cadastro', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        navigate('/cadastro-confirmado');
      }
    } else {
      toast.warn('As senhas não são iguais', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  useEffect(() => {
    getUfService().then(response => {
      setUfOptions(response.body);
    });
  }, [])

  return (
    <section className={FiscalRegisterStyle.Container}>
      <div className='flex w-1/3 items-center mb-8'>
        <BiChevronLeft className='cursor-pointer' size={44} onClick={() => navigate(-1)}/>
        <h1 className='text-3xl'>Cadastro</h1>
      </div>
      <div className='w-1/3 h-auto flex justify-between'>
        <div className='w-72 h-auto mt-4'>
          <Select placeholder="Estado"
            selectedValue={optionSelected}
            setSelectedValue={(item) => {
              setOptionSelected(item);
              getCityInformations(item);
            }}
            options={ufOptions}/>
        </div>
        <div className='w-72 mt-4'>
          <Select placeholder="Cidade"
            selectedValue={cityOptionSelected}
            setSelectedValue={(item) => {
              setCityOptionSelected(item);
              getComputerInformations(item)
            }}
            options={cities} />
        </div>
      </div>
      <div className='w-1/3 flex justify-between'>
        <Select placeholder="Ordenadores"
          selectedValue={computer}
          setSelectedValue={(item) => {
            setComputer(item);
          }}
          options={computersOptions}/>
      </div>
      <div className='w-1/3 mt-4'>
        <Input label='Telefone' placeholder='Telefone' value={phone} onChange={e => setPhone(e.target.value)} />
      </div>
      <div className='w-1/3 flex justify-between'>
        <div className='w-72 mt-4'>
          <Input label='Email' placeholder='Email' onChange={e => setEmail(e.target.value)} />
        </div>
        <div className='w-72 mt-4'>
          <Input label='Nome Completo' placeholder='Nome Completo' value={name} onChange={e => setName(e.target.value)} />
        </div>
      </div>
      <div className='w-1/3 mt-4'>
        <Input label='Matrícula' placeholder='Matrícula' onChange={e => setRegistration(e.target.value)} />
      </div>
      <div className='w-1/3 mt-4'>
        <Input label='Cargo' placeholder='Cargo' value={office} onChange={e => setOffice(e.target.value)} />
      </div>
      <div className='w-1/3 mt-4'>
        <Input label='Senha' placeholder='Senha' type='password' value={phrase} onChange={e => setPhrase(e.target.value)} />
      </div>
      <div className='w-1/3 mt-4'>
        <Input label='Repetir senha' placeholder='Repetir senha' type='password' value={confirmPhrase} onChange={e => setConfirmPhrase(e.target.value)} />
      </div>

      <div className='flex w-1/3 justify-between mt-16'>
        <div className='w-72'><Button label='Cancelar' type='second' onPress={() => {navigate(-1)}}/></div>
        <div className='w-72'><Button label='Cadastrar' onPress={handlerSubmit} /></div>
      </div>
    </section>
  )
}

export default FiscalRegister;