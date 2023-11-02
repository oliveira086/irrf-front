import { useState, useEffect } from 'react';
import { Form, useNavigate } from "react-router-dom";
import * as chakra from '@chakra-ui/react';

import Select from 'react-select'

import Header from '../../../components/molecules/Header';
import Input from '../../../components/atoms/Input';
import MoneyInput from '../../../components/atoms/MoneyInput';
import UploadFile from '../../../components/atoms/UploadFile';
import Button from '../../../components/atoms/Button';

import { getUserInformations, getComputersService } from '../../../services/authServices';
import { companyInformations, getCompanyCities, getCompanyByCnpj, companyPaymentSolicitation, companyPaymentSolicitationFiles  } from '../../../services/companyServices';
import { createPrePaymentByCompany } from '../../../services/prePaymentServices';
import convertCurrency from '../../../utils/convertCurrency';
import { SupplierHoldingStyle } from './style';

const SupplierHolding = () => {
  const [userName, setUserName] = useState('');
  const [cityName, setCityName] = useState('');

  const [citiesOptions, setCitiesOptions] = useState([]);
  const [citySelected, setCitySelected] = useState();
  const [companyOptions, setCompaniesOptions] = useState([]);
  const [company, setCompany] = useState();
  const [companyObjectSelected, setCompanyObjectSelected] = useState();
  const [computersOptions, setComputersOptions] = useState([]);

  const [value, setValue] = useState('');
  const [cnpj, setCNPJ] = useState('');
  const [taxNote, setTaxNote] = useState('');
  const [taxNoteSerie, setTaxNoteSerie] = useState('');
  const [fileUpload, setFileUpload] = useState();
  const [certidoesUpload, setCertidaoUpload] = useState();
  const [otherDocumentUpload, setOtherDocumentUpload] = useState();
  const [otherDocumentName, setOtherDocumentName] = useState('');
  const [responsibleName, setReponsibleName] = useState('');
  const [responsibleOffice, setResponsibleOffice] = useState('');

  const [computer, setComputer] = useState('');
  const [monthSelected, setMonthSelected] = useState();

  const [sigleTon, setSingleton] = useState(0);
  const [isLoading, setIsLoading] = useState(false);


  const monthOptions = [{ label: 'Janeiro', value: 'janeiro' }, { label: 'Fevereiro', value: 'fevereiro' }, { label: 'Março', value: 'marco' },
    { label: 'Abril', value: 'abril' }, { label: 'Maio', value: 'maio' }, { label: 'Junho', value: 'junho' }, { label: 'Julho', value: 'julho' },
    { label: 'Agosto', value: 'Agosto' }, { label: 'Setembro', value: 'setembro' }, { label: 'Outubro', value: 'outubro' }, { label: 'Novembro', value: 'novembro' },
    { label: 'Dezembro', value: 'dezembro' }
  ];

  const toast = chakra.useToast();
  const navigate = useNavigate();

  function handleUploadFile(files) {
    setFileUpload(files[0]);
  }

  function handleUploadCertidao(files) {
    setCertidaoUpload(files[0])
  }

  function handleUploadOtherDocument(files) {
    setOtherDocumentUpload(files[0])
  }

  const getComputerInformations = async (item) => {
    let response = await getComputersService({ city_id: item.value });
    setComputersOptions(response.body);
  }

  async function handleSubmit () { // Salvar Pre pagamento
    try {

      let validate = true;
      setIsLoading(true);

      if(certidoesUpload == undefined || certidoesUpload == null) {
        validate = false;
        toast({
          title: 'Por favor anexe as certidões!',
          status: 'error',
          position: 'top-right',
          isClosable: true
        });
      } else if(fileUpload == undefined || fileUpload == null) {
        validate = false;
        toast({
          title: 'Por favor anexe a nota fiscal!',
          status: 'error',
          position: 'top-right',
          isClosable: true
        });
      }

      if(sigleTon === 0 && validate == true) {
        const objectToSend = {
          "cnpj": cnpj,
          "company_id": companyObjectSelected?.value,
          "computer_id": computer?.id,
          "city_id": citySelected?.value,
          "tax_note": taxNote,
          "tax_note_serie": taxNoteSerie,
          "value": parseFloat(convertCurrency(value)),
          "outher_document_name": otherDocumentName,
          "month": monthSelected?.value,
          "year": "2023",
          "responsible": responsibleName,
          "responsible_office": responsibleOffice
        }

        const formToTaxNote = new FormData();
        const formToCertificates = new FormData();
        const formToOtherDocuments = new FormData();

        formToTaxNote.append('file', fileUpload);
        formToCertificates.append('file', certidoesUpload);
        formToOtherDocuments.append('file', otherDocumentUpload);

        await companyPaymentSolicitation(objectToSend).then(async resposeToPaymentSolicitation => {
          await companyPaymentSolicitationFiles({ id: resposeToPaymentSolicitation.body.id, type: 'taxNote', body: formToTaxNote });
          await companyPaymentSolicitationFiles({ id: resposeToPaymentSolicitation.body.id, type: 'certificates', body: formToCertificates });
          await companyPaymentSolicitationFiles({ id: resposeToPaymentSolicitation.body.id, type: 'other', body: formToOtherDocuments });

          toast({
            title: 'Solicitação criada com sucesso!',
            status: 'success',
            position: 'top-right',
            isClosable: true
          });

          navigate(-1);

        }).catch(err => {
          toast({
            title: 'Erro ao realizar a solicitação!',
            status: 'error',
            position: 'top-right',
            isClosable: true
          });
        })

      } else {
        // Mostrar toast alertando para aguardar a finalização do processo
        toast({
          title: 'Aguarde a solicitação ser processada!',
          status: 'info',
          position: 'top-right',
          isClosable: true
        });
      }

    } catch(error) {
      console.log(error);
      toast({
        title: 'Erro ao realizar a solicitação!',
        status: 'error',
        position: 'top-right',
        isClosable: true
      });
    }
  }

  useEffect(() => {
    (async () => await companyInformations().then(async response => {
      setUserName(response?.body?.company_name);
      setCompany({ label: response?.body?.company_name, value: response?.body?.id });
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
    setCompanyObjectSelected();

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
          <h1 className='text-3xl font-semibold'>Nova Solicitação de pagamento</h1>
        </div>

        <div className={SupplierHoldingStyle.FormContainer}>
          <h2 className='mb-10 text-2xl text-center'>Forneça as informações para<br></br>realizar uma nova solicitação</h2>

          <div className="w-full flex flex-row justify-around">

            <div className="w-2/5  mr-6">
              <div className={SupplierHoldingStyle.RowContainer}>
                <Input label='CNPJ' placeholder='CNPJ' value={cnpj} />
              </div>
              
              <div className={SupplierHoldingStyle.RowContainer}>
                <div className='w-full mr-4'>
                  <span className='mb-4 font-semibold'>Selecione a cidade</span>
                  <Select
                    options={citiesOptions}
                    value={citySelected}
                    onChange={(value) => {
                      selectCityToHolding(value);
                      getComputerInformations(value)
                    }}
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

              <div className={SupplierHoldingStyle.RowContainer}>
                <div className='w-full mr-4'>
                  <span className='mb-4 font-semibold'>Selecione a entidade pagadora</span>
                  <Select placeholder="Ordenadores"
                    value={computer}
                    onChange={(item) => {
                      setComputer(item);
                    }}
                    options={computersOptions} />
                </div>
              </div>

              <div className={SupplierHoldingStyle.RowTwoInputs}>
                <div className='w-96 mr-4'>
                  <Input label='Nota fiscal' placeholder='Número da nota fiscal' value={taxNote} onChange={e => setTaxNote(e.target.value)} />
                </div>
                <div>
                  <Input label='Número de série da Nota Fiscal' placeholder='Serie' value={taxNoteSerie} onChange={e => setTaxNoteSerie(e.target.value)} />
                </div>
              </div>

              <div className={SupplierHoldingStyle.RowContainer}>
                <div className='w-full mr-4'>
                  <MoneyInput label='Crédito / Pagamento R$' placeholder='Crédito de pagamento' value={value} onChange={e => setValue(e.target.value)} />
                </div>
              </div>

              <div className={SupplierHoldingStyle.RowContainer}>
                <div className='w-full mr-4'>
                  <span className='mb-4 font-semibold'>Selecione o mês da realização da despesa </span>
                  <Select
                    options={monthOptions}
                    value={monthSelected}
                    onChange={(value) => {setMonthSelected(value)}}
                  />
                </div>
              </div>
              

            </div>

            <div className="flex flex-col w-2/5 justify-center">
              <div className={SupplierHoldingStyle.RowContainer}>
                <UploadFile title='Anexar Nota Fiscal' file={fileUpload}
                  onUpload={handleUploadFile}
                  accept={{'image/pdf': ['.pdf']}}
                  />
              </div>

              <div className={SupplierHoldingStyle.RowContainer}>
                <UploadFile title='Anexar Certidões de Regularidade fiscal' file={certidoesUpload}
                  onUpload={handleUploadCertidao}
                  accept={{'image/pdf': ['.pdf']}}
                  />
              </div>

              <div className="mt-10">
                <div className={SupplierHoldingStyle.RowContainer}>
                  <UploadFile title='Anexar outro documento' file={otherDocumentUpload}
                    onUpload={handleUploadOtherDocument}
                    accept={{'image/pdf': ['.pdf']}}
                    />
                </div>
              </div>

              <div className={SupplierHoldingStyle.RowContainer}>
                <div className='mr-4'>
                  <Input label='Descrição do documento anexado' placeholder='Nome do documento anexado' value={otherDocumentName} onChange={e => setOtherDocumentName(e.target.value)} />
                </div>
              </div>

              <div className={SupplierHoldingStyle.RowContainer}>
                <div className='mr-4'>
                  <Input label='Nome do requerente' placeholder='Requerente' value={responsibleName} onChange={e => setReponsibleName(e.target.value)} />
                </div>
              </div>

              <div className={SupplierHoldingStyle.RowContainer}>
                <div className='mr-4'>
                  <Input label='Função / Cargo do requerente' placeholder='Cargo do requerente' value={responsibleOffice} onChange={e => setResponsibleOffice(e.target.value)} />
                </div>
              </div>

              <div className={SupplierHoldingStyle.ButtonContainer}>
                <Button label='Salvar' isLoading={isLoading} onPress={() => handleSubmit()}/>
              </div>
            </div>
            
          </div>

          
        </div>

      </div>
    </section>
 ) 
}

export default SupplierHolding;