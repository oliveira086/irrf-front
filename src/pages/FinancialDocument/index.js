import React, { useState, useEffect } from 'react';
import ReactToPrint from 'react-to-print';
import { useNavigate } from "react-router-dom";
import { Player } from '@lottiefiles/react-lottie-player';

import Button from '../../components/atoms/Button';

import { DespachoTemplate } from '../../utils/Despacho';
import formatDate from '../../utils/formatDate';

import { getPayment } from '../../services/paymentServices';

import { FinancialDocumentStyle } from './style';

const FinancialDocument = () => {

  const navigate = useNavigate();
  const [text, setText] = React.useState("old boring text");

  const [paymentId, setPaymentId] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [uf, setUf] = useState('');
  const [company, setCompany] = useState('');
  const [CNPJCompany, setCNPJCompany] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [index, setIndex] = useState('');
  const [taxValue, setTaxValue] = useState('');
  const [liquidValue, setLiquidValue] = useState('');
  const [userName, setUserName] = useState('');
  const [registration, setRegistration] = useState('');
  const [prefectureCNPJ, setPrefectureCNPJ] = useState('');
  const [datePayment, setDatePayment] = useState('');
  const [computerName, setComputerName] = useState('');
  const [computerCnpj, setComputerCnpj] = useState('');
  const [taxNote, setTaxNote] = useState('');
  const [calculateBasis, setCalculationBasis] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [paymentAssociate, setPaymentAssociate] = useState();
  const [paymentType, setPaymentType] = useState('');
  const [irrfCode, setIrrfCode] = useState('');
  const [isPaymentAssociate, setIsPaymentAssociate] = useState(false);

  const componentRef = React.useRef();

  const reactToPrintTrigger = React.useCallback(() => {
    if(loaded == false) {
      return <></>
    } else {
      return (
        <div className={FinancialDocumentStyle.ButtonsContainer}>
          <Button id="button" label='Imprimir Despacho'/>
        </div>
      )
    }
  }, [loaded]);

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const getInformations = async() => {
    let payment = sessionStorage.getItem('payment_id');
    setPaymentId(payment);

    let response = await getPayment({ payment_id: payment });

    if(response !== 401 || response !== 503 || response !== 500) {

      let paymentAssociate = {
        calculation_basis: response.body?.['payment_associate_id.calculation_basis'],
        city_id: response.body?.['payment_associate_id.city_id'],
        cnpj: response.body?.['payment_associate_id.cnpj'],
        company_id: response.body?.['payment_associate_id.company_id'],
        company_name: response.body?.['payment_associate_id.company_name'],
        computer_id: response.body?.['payment_associate_id.computer_id'],
        createdAt: response.body?.['payment_associate_id.createdAt'],
        enabled: response.body?.['payment_associate_id.enabled'],
        id: response.body?.['payment_associate_id.id'],
        iss_item: response.body?.iss_item,
        index: response.body?.['payment_associate_id.index'],
        iss_services_id: response.body?.['payment_associate_id.iss_services_id'],
        net_of_tax: response.body?.['payment_associate_id.net_of_tax'],
        payment_associate: response.body?.['payment_associate_id.payment_associate'],
        products_services_id: response.body?.['payment_associate_id.products_services_id'],
        sended: response.body?.['payment_associate_id.sended'],
        status: response.body?.['payment_associate_id.status'],
        tax_note: response.body?.['payment_associate_id.tax_note'],
        tax_note_link: response.body?.['payment_associate_id.tax_note_link'],
        tax_note_serie: response.body?.['payment_associate_id.tax_note_serie'],
        transferred: response.body?.['payment_associate_id.transferred'],
        type: response.body?.['payment_associate_id.type'],
        updatedAt: response.body?.['payment_associate_id.updatedAt'],
        user_id: response.body?.['payment_associate_id.user_id'],
        value: response.body?.['payment_associate_id.value'],
        withheld_tax: response.body?.['payment_associate_id.withheld_tax'],
      }


      setPaymentAssociate(paymentAssociate);
      setPaymentType(response.body.type);
      setIrrfCode(response.body?.['products_services_id_payments.code']);
      setComputerCnpj(response.body?.['computer_id_payments.cnpj']);
      setMunicipio(response.body['user_id_payments.user_city_id.label']);
      setUf(response.body['user_id_payments.user_city_id.city_uf_id.label']);
      setCompany(response.body['company_name']);
      setCNPJCompany(response.body.cnpj);
      setTotalValue(response.body.value);
      setIndex(response.body.index);
      setTaxValue(response.body.withheld_tax);
      setLiquidValue(response.body.net_of_tax);
      setUserName(response.body['user_id_payments.name']);
      setRegistration(response.body['user_id_payments.registration']);
      setPrefectureCNPJ(response.body['user_id_payments.user_city_id.cnpj']);
      setComputerName(response.body['computer_id_payments.label']);
      let date = formatDate(response.body.createdAt);
      setDatePayment(date);
      setTaxNote(`${response.body.tax_note}-${response.body.tax_note_serie}`);
      setCalculationBasis(response.body.calculation_basis);
      setIsPaymentAssociate(response.payment_associate !== null ? true : false);
      setLoaded(true);
    } else {

    }
  } 

  useEffect(() => {
    getInformations();
  }, []);

  return (
    <section className={FinancialDocumentStyle.Container}>
      <div className={FinancialDocumentStyle.BodyContainer}>
        <div className={FinancialDocumentStyle.PlayerContainer}>
          <Player
            src='https://assets6.lottiefiles.com/packages/lf20_m3ixidnq.json'
            className="player"
            loop
            autoplay
          />
        </div>
        <ReactToPrint
          content={reactToPrintContent}
          documentTitle="Despacho"
          removeAfterPrint
          trigger={reactToPrintTrigger}
        />
        <div className={FinancialDocumentStyle.ButtonsContainer}>
          <Button label='Voltar' type="second" onPress={() => navigate(-1)}/>
        </div>

        <div className='absolute h-26 invisible'>
        <DespachoTemplate id="template" ref={componentRef} text={text} payment_id={paymentId} payment_type={paymentType}
        city={municipio} UF={uf} company={company} cnpj_company={CNPJCompany} computer_name={computerName} computer_cnpj={computerCnpj}
        NF_value={totalValue} NF_index={index} NF_tax_value={taxValue} prefecture_cnpj={prefectureCNPJ} irrf_code={irrfCode}
        NF_liquid_value={liquidValue} user_name={userName} registration={registration} associate_validation={isPaymentAssociate}
        month_payment={datePayment} tax_note={taxNote} calculate_basis={calculateBasis} payment_associate={paymentAssociate}/>
        </div>
      </div>
    </section>
  )
}

export default FinancialDocument;