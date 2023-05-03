import React, { useState, useEffect } from 'react';
import ReactToPrint from 'react-to-print';
import { useNavigate } from "react-router-dom";
import { Player } from '@lottiefiles/react-lottie-player';

import Button from '../../components/atoms/Button';

import { FunctionalTemplateDoubleRecibo } from '../../utils/Extrato';
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
  const [secretary, setSecretary] = useState('');
  const [prefectureCNPJ, setPrefectureCNPJ] = useState('');
  const [datePayment, setDatePayment] = useState('');
  const [computerName, setComputerName] = useState('');
  const [taxNote, setTaxNote] = useState('');
  const [calculateBasis, setCalculationBasis] = useState('');
  const [paymentAssociateState, setPaymentAssociateState] = useState('');
  const [computerCnpj, setComputerCnpj] = useState('');
  const [companyObject, setCompanyObject] = useState('');
  const [issItem, setIssItem] = useState('');
  const [irrfCode, setirrfCode] = useState('');
  const [paymentType, setPaymentType] = useState('');

  const componentRef = React.useRef();

  const reactToPrintTrigger = React.useCallback(() => {
    return (
      <div className={FiscalDocumentStyle.ButtonsContainer}>
        <Button id="button" label='Imprimir Recibo'/>
      </div>
    )
  }, []);

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const getInformations = async() => {
    let payment = sessionStorage.getItem('payment_id');
    setPaymentId(payment);

    let response = await getPayment({ payment_id: payment });

    let paymentAssociate = {
      calculation_basis: response.body['payment_associate_id.calculation_basis'],
      city_id: response.body['payment_associate_id.city_id'],
      cnpj: response.body['payment_associate_id.cnpj'],
      company_id: response.body['payment_associate_id.company_id'],
      company_name: response.body['payment_associate_id.company_name'],
      computer_id: response.body['payment_associate_id.computer_id'],
      createdAt: response.body['payment_associate_id.createdAt'],
      enabled: response.body['payment_associate_id.enabled'],
      id: response.body['payment_associate_id.id'],
      index: response.body['payment_associate_id.index'],
      iss_services_id: response.body['payment_associate_id.iss_services_id'],
      net_of_tax: response.body['payment_associate_id.net_of_tax'],
      payment_associate: response.body['payment_associate_id.payment_associate'],
      products_services_id: response.body['payment_associate_id.products_services_id'],
      sended: response.body['payment_associate_id.sended'],
      status: response.body['payment_associate_id.status'],
      tax_note: response.body['payment_associate_id.tax_note'],
      tax_note_link: response.body['payment_associate_id.tax_note_link'],
      tax_note_serie: response.body['payment_associate_id.tax_note_serie'],
      transferred: response.body['payment_associate_id.transferred'],
      type: response.body['payment_associate_id.type'],
      updatedAt: response.body['payment_associate_id.updatedAt'],
      user_id: response.body['payment_associate_id.user_id'],
      value: response.body['payment_associate_id.value'],
      withheld_tax: response.body['payment_associate_id.withheld_tax'],
    }

    setPaymentAssociateState(paymentAssociate);

    if(response !== 401 || response !== 503 || response !== 500) {
      setMunicipio(response.body['user_id_payments.user_city_id.label']);
      setUf(response.body['user_id_payments.user_city_id.city_uf_id.label']);
      setCompany(response.body['company_name']);
      setCNPJCompany(response.body.cnpj);
      setTotalValue(response.body.value);
      setIndex(response.body.index);
      setTaxValue(response.body.withheld_tax);
      setLiquidValue(response.body.net_of_tax);
      setUserName(response.body.secretary.name);
      setRegistration(response.body.secretary.registration);
      setSecretary(response.body.secretary.secretary);
      setPrefectureCNPJ(response.body['user_id_payments.user_city_id.cnpj']);
      setComputerName(response.body['computer_id_payments.label']);
      let date = formatDate(response.body.createdAt);
      setDatePayment(date);
      setTaxNote(response.body.tax_note);
      setCalculationBasis(response.body.calculation_basis);
      setComputerCnpj(response.body['computer_id_payments.cnpj']);
      setCompanyObject(response.body['company_id_payments.object']);
      setIssItem(response.body.iss_item);
      setirrfCode(response.body['products_services_id_payments.code']);
      setPaymentType(response.body.type);
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
          documentTitle="Extrato de Retenção"
          removeAfterPrint
          trigger={reactToPrintTrigger}
        />
        <div className={FiscalDocumentStyle.ButtonsContainer}>
          <Button label='Voltar' type="second" onPress={() => navigate(-1)}/>
        </div>

        <div className='absolute h-26 invisible'>
          <FunctionalTemplateDoubleRecibo id="template" ref={componentRef} text={text} payment_id={paymentId}
            city={municipio} UF={uf} company={company} cnpj_company={CNPJCompany} computer_name={computerName}
            NF_value={totalValue} NF_index={index} NF_tax_value={taxValue} prefecture_cnpj={prefectureCNPJ}
            NF_liquid_value={liquidValue} user_name={userName} registration={registration} computer_cnpj={computerCnpj}
            month_payment={datePayment} tax_note={taxNote} calculate_basis={calculateBasis} payment_associate={paymentAssociateState}
            company_object={companyObject} iss_item={issItem} irrf_code={irrfCode} payment_type={paymentType} user_secretary={secretary}/>
        </div>
      </div>
    </section>
  )
}

export default FiscalDocument;