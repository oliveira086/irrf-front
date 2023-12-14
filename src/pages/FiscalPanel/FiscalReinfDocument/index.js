import React, { useState, useEffect } from 'react';
import ReactToPrint from 'react-to-print';
import { useNavigate } from "react-router-dom";
import { Player } from '@lottiefiles/react-lottie-player';

import Button from '../../../components/atoms/Button';

import { FunctionalTemplateReinfDocument } from '../../../utils/ReinfDocument';
import formatDate from '../../../utils/formatDate';
import { formatCpfOrCnpj } from '../../../utils/formatCpfAndCnpj'

import { getPayment } from '../../../services/paymentServices';
import { get4020Informations } from '../../../services/reinfServices';

import { FiscalReinfDocumentStyle } from './style';

const FiscalReinfDocument = () => {

  const navigate = useNavigate();
  const [text, setText] = React.useState("old boring text");

  const [paymentId, setPaymentId] = useState('');
  const [reinfData, setReinfData] = useState('{}');
  const [paymentData, setPaymentData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const componentRef = React.useRef();

  const reactToPrintTrigger = React.useCallback(() => {
    return (
      
      <div className={FiscalReinfDocumentStyle.ButtonsContainer}>
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

    const responseToget4020Informations = await get4020Informations({ payment_id: payment });
    let response = await getPayment({ payment_id: payment });
    
    setReinfData(JSON.stringify(responseToget4020Informations.body));
    setPaymentData(response.body);
    setIsLoading(false)
  } 

  useEffect(() => {
    getInformations();
  }, []);

  return (
    <section className={FiscalReinfDocumentStyle.Container}>
      <div className={FiscalReinfDocumentStyle.BodyContainer}>
        <div className={FiscalReinfDocumentStyle.PlayerContainer}>
          <Player
            src='https://assets6.lottiefiles.com/packages/lf20_m3ixidnq.json'
            className="player"
            loop
            autoplay
          />
        </div>
        <ReactToPrint
          content={reactToPrintContent}
          documentTitle="Extrato de envio REINF"
          removeAfterPrint
          trigger={isLoading ? '': reactToPrintTrigger}
        />
        <div className={FiscalReinfDocumentStyle.ButtonsContainer}>
          <Button label='Voltar' type="second" onPress={() => navigate(-1)}/>
        </div>

        <div className='absolute h-26 invisible'>

          <FunctionalTemplateReinfDocument id="template" ref={componentRef} text={text}
            protocolo={JSON.parse(reinfData)?.protocolo} cnpjFornecedor={formatCpfOrCnpj(paymentData?.cnpj)} cnpjOrdenador={paymentData?.['computer_id_payments.cnpj']}
            company_name={paymentData?.['company_id_payments.label']} ordenadorName={paymentData?.['computer_id_payments.label']} cityName={paymentData?.['company_id_payments.city']}
            cityCnpj={paymentData?.['computer_id_payments.cnpj']} notafiscal={paymentData?.tax_note}
            competencia={JSON.parse(reinfData)?.eventos?.[0]['R9005'].ideEvento.perApur}
            value={paymentData?.value} IRValue={JSON.parse(reinfData)?.eventos?.[0]['R9005'].totApurMen?.[0].totApurTribMen?.[0]?.vlrCRMenInf.replace(',', '.')}
           />
        </div>
      </div>
    </section>
  )
}

export default FiscalReinfDocument;