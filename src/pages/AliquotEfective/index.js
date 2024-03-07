import { useEffect, useState, useMemo } from 'react';
import * as chakra from '@chakra-ui/react';
import { useNavigate,
  BrowserRouter as Router,
  useLocation
} from "react-router-dom";

import Header from '../../components/molecules/Header';
import Button from "../../components/atoms/Button";
import Input from "../../components/atoms/Input";
import MoneyInput from '../../components/atoms/MoneyInput';

import { getUserInformations } from "../../services/authServices";
import { getAliquotEfectiveCompany } from "../../services/prePaymentServices";
import convertCurrency from '../../utils/convertCurrency';

import { AliquotEfectiveStyle } from './style';

const AliquotEfective = () => {
  const [userName, setUserName] = useState('');
  const [cityName, setCityName] = useState(''); 
  const [cnpj, setCnpj] = useState('');
  const [aliquot, setAliquot] = useState(0);
  const [aliquotSimples, setAliquotSimples] = useState(0);
  const [value, setValue] = useState('');
  const [withheld, setWithheld] = useState(0);
  const [netOfTax, setNetOfTax] = useState(0);

  async function searchCompany (cnpj) {
    const response = await getAliquotEfectiveCompany({ cnpj: cnpj });
    setAliquot(response.body.aliquot_efective);
    setAliquotSimples(response.body.aliquot_simples);
  }

  function calculate () {
    const valueConvert = parseFloat(convertCurrency(value))
    const aliquotConvert = (parseFloat(aliquot) / 1000 );

    const withheld_tax = (valueConvert * (aliquotConvert)).toFixed(2);
    const net_of_tax = (valueConvert - (valueConvert * (aliquotConvert))).toFixed(2);

    setWithheld(withheld_tax);
    setNetOfTax(net_of_tax);
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

        {
          aliquot !== 0 ?
          <>
            <div className='flex flex-col items-center w-3/5 h-auto pt-10'>
              <div className='w-full'>
                <MoneyInput label='Valor da nota' placeholder='Crédito de pagamento' value={value} onChange={e => setValue(e.target.value)} />
              </div>
              <div className='w-full mt-6'>
                <Button label='Calcular' onPress={() => calculate()} />
              </div>

              <div className='w-full mt-6 p-4 border rounded-md'>
                <div className="flex flex-col w-full h-auto mt-6">
                  <div><span>{`Aliquota do Simples: ${aliquotSimples}%`}</span></div>
                  <div><span>{`Aliquota Efetiva ISS: ${aliquot}%`}</span></div>
                </div>

                <div className="flex flex-col w-full h-auto mt-6">
                  <div><span>{`Valor Retido: R$ ${withheld}`}</span></div>
                  <div><span>{`Valor Liquido: R$ ${netOfTax}`}</span></div>
                </div>
              </div>
              
            </div>
          </>
          :
          <></>
        }


      </div>
    </section>
  )
}

export default AliquotEfective;