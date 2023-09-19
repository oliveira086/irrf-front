import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import * as chakra from '@chakra-ui/react';

import Select from 'react-select'

import Header from '../../../components/molecules/Header';
import Input from '../../../components/atoms/Input';
import SelectFilter from '../../../components/atoms/SelectFilter';
import UploadFile from '../../../components/atoms/UploadFile';
import Button from '../../../components/atoms/Button';

import { getUserInformations } from '../../../services/authServices';
import { companyInformations, getCompanyCities, getCompanyByCnpj  } from '../../../services/companyServices';
import { createPrePaymentByCompany } from '../../../services/prePaymentServices';
import { SupplierHoldingStyle } from './style';

const SupplierHolding = () => {
  const [userName, setUserName] = useState('');
  const [cityName, setCityName] = useState('');

  const [citiesOptions, setCitiesOptions] = useState([]);
  const [citySelected, setCitySelected] = useState();
  const [companyOptions, setCompaniesOptions] = useState([]);
  const [company, setCompany] = useState();
  const [companyObjectSelected, setCompanyObjectSelected] = useState();

  const [cnpj, setCNPJ] = useState('');
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

        await createPrePaymentByCompany({ phone: phone, taxNote: `${taxNote}-${taxNoteSerie}`, cnpj: company?.value, company_id: companyObjectSelected.value, body: form }).then(responseToCreatePrePayment => {
          
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
      console.log(error);
      toast({
        title: 'Erro ao salvar o Pre pagamento!',
        status: 'error',
        position: 'top-right',
        isClosable: true,
      });
    }
  }

  useEffect(() => {
    (async () => await companyInformations().then(async response => {
      setUserName(response?.body?.company_name);
      setCompany({ label: response?.body?.company_name, value: response?.body?.cnpj});
      setCNPJ(response?.body?.cnpj);

      await getCompanyCities().then(response => {
        setCitiesOptions(response?.body);
        const arrayCities = [];
        const setToValidade = new Set();

        response?.body?.map(citiesCompanyCallback => {
          if(setToValidade.has(citiesCompanyCallback?.city_id)) {
            //pass
          } else {
            arrayCities.push({ label: citiesCompanyCallback?.['company_city_id.label'], value: citiesCompanyCallback?.city_id })
            setToValidade.add(citiesCompanyCallback?.city_id);
          }

        });
        setCitiesOptions(arrayCities);
      })

    }))()

  }, []);

  const selectCityToHolding = async (params) => {
    setCitySelected(params);

    await getCompanyByCnpj({ cnpj: cnpj, city_id: params?.value }).then(response => {

      const arrayCompaniesOptions = [];

      response?.body?.map(companiesCallback => {
        arrayCompaniesOptions.push({ label: companiesCallback?.object, value: companiesCallback?.id })
      });

      setCompaniesOptions(arrayCompaniesOptions);

      if(arrayCompaniesOptions.length <= 1) {
        setCompanyObjectSelected(arrayCompaniesOptions[0])
      }
      
    });
  }

  return (
    <section className={SupplierHoldingStyle.Container}>
      <Header userName={userName} cityName={cityName} />
      <div className={SupplierHoldingStyle.BodyContainer}>
        <div className={SupplierHoldingStyle.TitleContainer}>
          <h1 className='text-3xl font-semibold'>Nova retenção</h1>
        </div>

        <div className={SupplierHoldingStyle.FormContainer}>
          <h2 className='mb-10 text-2xl text-center'>Forneça as informações para<br></br>realizar uma nova retenção</h2>

          <div className={SupplierHoldingStyle.RowContainer}>
            <Input label='CNPJ' placeholder='CNPJ' value={cnpj} />
          </div>
          <div className={SupplierHoldingStyle.RowContainer}>
            <div className='w-full mr-4'>
              <span className='mb-4 font-semibold'>Selecione a cidade</span>
              <Select
                options={citiesOptions}
                value={citySelected}
                onChange={(value) => selectCityToHolding(value)}
              />
            </div>
          </div>

          {
            companyOptions.length > 1 ?
            <>
              <div className={SupplierHoldingStyle.RowContainer}>
                <div className='w-full mr-4'>
                  <span className='mb-4 font-semibold'>Selecione o objeto do contrato</span>
                  <Select
                    options={companyOptions}
                    value={companyObjectSelected}
                    onChange={(value) => setCompanyObjectSelected(value)}
                  />
                </div>
              </div>
            </>
            :
            <></>
          }

          <div className={SupplierHoldingStyle.RowTwoInputs}>
            <div className='mr-4'>
              <Input label='Nota fiscal' placeholder='Número da nota fiscal' value={taxNote} onChange={e => setTaxNote(e.target.value)} />
            </div>
            <div>
              <Input label='Número de série da Nota Fiscal' placeholder='Serie' value={taxNoteSerie} onChange={e => setTaxNoteSerie(e.target.value)} />
            </div>
          </div>
          <div className={SupplierHoldingStyle.RowContainer}>
            <UploadFile title='Anexar Nota Fiscal' file={fileUpload}
              onUpload={handleUploadFile}
              accept={{'image/pdf': ['.pdf', '.png', '.jpg', '.jpeg']}}
            />
          </div>

          <div className={SupplierHoldingStyle.ButtonContainer}>
            <Button label='Salvar' isLoading={isLoading} onPress={() => handleSubmit()}/>
          </div>
        </div>

      </div>
    </section>
 ) 
}

export default SupplierHolding;