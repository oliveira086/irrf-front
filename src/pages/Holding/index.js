import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import * as chakra from '@chakra-ui/react';

import Header from '../../components/molecules/Header';
import Input from '../../components/atoms/Input';
import SelectFilter from '../../components/atoms/SelectFilter';
import UploadFile from '../../components/atoms/UploadFile';
import Button from '../../components/atoms/Button';

import { getUserInformations } from '../../services/authServices';
import { createPrePayment } from '../../services/prePaymentServices';
import { HoldingStyle } from './style';

const Holding = () => {
  const [userName, setUserName] = useState('');
  const [cityName, setCityName] = useState('');

  const [company, setCompany] = useState();
  const [taxNote, setTaxNote] = useState('');
  const [taxNoteSerie, setTaxNoteSerie] = useState('');
  const [fileUpload, setFileUpload] = useState();

  const [phone, setPhone] = useState('');
  const [hasProductAndServices, setHasProductAndServices] = useState();
  const [isProduct, setIsProduct] = useState();
  const [isService, setIsService] = useState();

  const [sigleTon, setSingleton] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const toast = chakra.useToast();
  const navigate = useNavigate();

  function handleUploadFile(files) {
    setFileUpload(files[0]);
  }

  async function handleSubmit () { // Salvar Pre pagamento
    try {
      setIsLoading(true);
      if(sigleTon === 0) {
        const form = new FormData();
        form.append('file', fileUpload);

        await createPrePayment({ phone: phone, taxNote: `${taxNote}-${taxNoteSerie}`, cnpj: company.cnpj, body: form }).then(responseToCreatePrePayment => {
          
          toast({
            title: 'Pre pagamento Salvo!',
            status: 'success',
            position: 'top-right',
            isClosable: true,
          });

          setIsLoading(false);
          setSingleton(1);
          navigate(-1);

        }).catch(error => {
          toast({
            title: 'Houve um erro ao salvar o Pre pagamento!',
            status: 'error',
            position: 'top-right',
            isClosable: true,
          });

          setIsLoading(false);
          setSingleton(0);
        });

      } else {
        // Mostrar toast alertando para aguardar a finalização do processo
        toast({
          title: 'Aguarde o Pre pagamento ser salvo!',
          status: 'info',
          position: 'top-right',
          isClosable: true,
        });
      }

    } catch(error) {
      toast({
        title: 'Erro ao salvar o Pre pagamento!',
        status: 'error',
        position: 'top-right',
        isClosable: true,
      });
    }
  }

  useEffect(() => {
    (async () => await getUserInformations({ currentPage: 1 }).then(response => {
      setUserName(response?.body?.user_name);
      setCityName(response?.body?.city_name);
      setPhone(response?.body?.phone);
    }))()
  }, []);

  return (
    <section className={HoldingStyle.Container}>
      <Header userName={userName} cityName={cityName} />
      <div className={HoldingStyle.BodyContainer}>
        <div className={HoldingStyle.TitleContainer}>
          <h1 className='text-3xl font-semibold'>Nova retenção</h1>
        </div>

        <div className={HoldingStyle.FormContainer}>
          <h2 className='mb-10 text-2xl text-center'>Forneça as informações para<br></br>realizar uma nova retenção</h2>
          <div className={HoldingStyle.RowContainer}>
            
            <SelectFilter selectedValue={company}
              setSelectedValue={setCompany}
              setHasProductAndServices={setHasProductAndServices}
              setIsProduct={setIsProduct}
              setIsService={setIsService}
            />
          </div>
          <div className={HoldingStyle.RowTwoInputs}>
            <div className='mr-4'>
              <Input label='Nota fiscal' placeholder='Número da nota fiscal' value={taxNote} onChange={e => setTaxNote(e.target.value)} />
            </div>
            <div>
              <Input label='Número de série da Nota Fiscal' placeholder='Serie' value={taxNoteSerie} onChange={e => setTaxNoteSerie(e.target.value)} />
            </div>
          </div>
          <div className={HoldingStyle.RowContainer}>
            <UploadFile title='Anexar Nota Fiscal' file={fileUpload}
              onUpload={handleUploadFile}
              accept={{'image/pdf': ['.pdf', '.png', '.jpg', '.jpeg']}}
            />
          </div>

          <div className={HoldingStyle.ButtonContainer}>
            <Button label='Salvar' isLoading={isLoading} onPress={() => handleSubmit()}/>
          </div>

        </div>

      </div>
    </section>
 ) 
}

export default Holding;