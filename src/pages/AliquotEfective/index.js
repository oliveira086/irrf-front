import { useEffect, useState, useMemo } from 'react';
import * as chakra from '@chakra-ui/react';
import { useNavigate,
  BrowserRouter as Router,
  useLocation
} from "react-router-dom";

import Header from '../../components/molecules/Header';
import Button from "../../components/atoms/Button";
import Input from "../../components/atoms/Input";

import { getUserInformations } from "../../services/authServices";
import { getAliquotEfectiveCompany } from "../../services/prePaymentServices";

import { AliquotEfectiveStyle } from './style';

const AliquotEfective = () => {
  const [userName, setUserName] = useState('');
  const [cityName, setCityName] = useState(''); 
  const [cnpj, setCnpj] = useState('');

  async function searchCompany (cnpj) {
    const response = await getAliquotEfectiveCompany({ cnpj: cnpj });
    console.log("🚀 ~ searchCompany ~ response:", response.body)
    
  }

  useEffect(() => {
    (async () => {
      await getUserInformations({ currentPage: 1 }).then(response => {
        setUserName(response.body.user_name);
        setCityName(response.body.city_name);
      });

    })();
  }, []);
  return (
    <section className={AliquotEfectiveStyle.Container}>
      <Header userName={userName} cityName={cityName} />
      <div className={AliquotEfectiveStyle.BodyContainer}>
        <div className='flex flex-col items-center w-3/5 h-auto pt-10'>
          <h2 className='font-semibold'>Digite o CNPJ do fornecedor</h2>
          <div className='flex flex-row items-end justify-around w-full h-auto mt-6'>
            <div className='w-3/4'>
              <Input label="CNPJ" placeholder={'CNPJ'} value={cnpj} onChange={e => setCnpj(e.target.value)}/>
            </div>
            <div className='w-56'>
              <Button label='Pesquisar' onPress={() => searchCompany(cnpj)} />
            </div>
          </div>
        </div>
        
      </div>
    </section>
  )
}

export default AliquotEfective;