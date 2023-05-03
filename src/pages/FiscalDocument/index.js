import React, { useState, useEffect } from 'react';
import ReactToPrint from 'react-to-print';
import { useNavigate } from "react-router-dom";
import { Player } from '@lottiefiles/react-lottie-player';

import Button from '../../components/atoms/Button';

import { TemplateDoubleRecibo } from '../../utils/Extrato';
import formatDate from '../../utils/formatDate';

import { getPayment } from '../../services/paymentServices';

import { FiscalDocumentStyle } from './style';

const FiscalDocument = () => {

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
  const [taxNote, setTaxNote] = useState('');
  const [calculateBasis, setCalculationBasis] = useState('');

  const componentRef = React.useRef(null);

  const reactToPrintTrigger = React.useCallback(() => {
    return  <div className={FiscalDocumentStyle.ButtonsContainer}><Button id="button" label='Imprimir Recibo' /></div>
  }, []);

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const getInformations = async() => {
    let payment = sessionStorage.getItem('payment_id');
    setPaymentId(payment);

    let response = await getPayment({ payment_id: payment });

    if(response !== 401 || response !== 503 || response !== 500) {
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
      setTaxNote(response.body.tax_note);
      setCalculationBasis(response.body.calculation_basis)
    } else {

    }
  } 

  useEffect(() => {
    getInformations();
  }, []);

  return (
    <section className={FiscalDocumentStyle.Container}>
      <div className={FiscalDocumentStyle.BodyContainer}>
        <div className={FiscalDocumentStyle.PlayerContainer}>
          <Player
            src='https://assets6.lottiefiles.com/packages/lf20_m3ixidnq.json'
            className="player"
            loop
            autoplay
          />
        </div>
        <ReactToPrint
          content={reactToPrintContent}
          documentTitle="Extrato De Retenção"
          removeAfterPrint
          trigger={reactToPrintTrigger}
        />

        <TemplateDoubleRecibo id="template" ref={componentRef} text={text} payment_id={paymentId}
          city={municipio} UF={uf} company={company} cnpj_company={CNPJCompany} computer_name={computerName}
          NF_value={totalValue} NF_index={index} NF_tax_value={taxValue} prefecture_cnpj={prefectureCNPJ}
          NF_liquid_value={liquidValue} user_name={userName} registration={registration}
          month_payment={datePayment} tax_note={taxNote} calculate_basis={calculateBasis}/>

        <div className={FiscalDocumentStyle.ButtonsContainer}>
          <Button label='Voltar' type="second" onPress={() => navigate(-1)}/>
        </div>
      </div>
    </section>
  )
}

export default FiscalDocument;