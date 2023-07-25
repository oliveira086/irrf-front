import * as React from "react";
export class TemplateDoubleRecibo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { checked: false };
  }

  handleCheckboxOnChange = () => {
    this.setState({ checked: !this.state.checked });
  }

  setRef = (ref) => (this.canvasEl = ref);

  render() {
    let cnpjOrCpfFormated;
    let fromCurrency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

    if(this.props.cnpj_company.length > 11) {
      cnpjOrCpfFormated = this.props.cnpj_company.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    } else {
      cnpjOrCpfFormated = this.props.cnpj_company.replace(/^(\d{3})(\d{3})(\d{3})/, "$1.$2.$3-")
    }

    if(this.props.payment_type == 'ordinario') {

      return (
        <>
          <div className="relativeCSS">
            <style type="text/css" media="print">
            </style>
            <div className="flash" />
            <table className="testClass" style={{marginLeft: '60px', marginTop: '60px'}}>
              <thead>
                <div style={{ display: 'flex', border: '1px solid #000', marginRight: '32px', justifyContent: 'space-between'}}>
                  <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #000', padding: '10px' }}>
                    <span style={{ fontWeight: 'bold'}}>COMPETÊNCIA</span>
                    <span>{`${this.props.month_payment?.day} de ${this.props.month_payment.month} de ${this.props.month_payment?.year}`}</span>
                  </div>
                  <div style={{ width: '500px', textAlign: 'center'}}>
                    <span style={{ fontWeight: 'bold'}}>COMPROVANTE DE RENDIMENTOS PAGOS OU CREDITADOS E DE RETENÇÃO DE IMPOSTO DE RENDA NA FONTE – PESSOA JURÍDICA</span>
                  </div>
                </div>
              </thead>
              <div style={{ width: '100%', heigth: '20px'}}>
                <span style={{visibility: 'hidden'}}>teste</span>
              </div>

              <tbody>
                <tr>
                  <div style={{ display: 'flex', width: '100%', heigth: '10px'}}>
                    <div style={{ display: 'flex', width: '98%', heigth: '10px'}}>
                     <span style={{ fontWeight: 'bold'}}>1. FONTE PAGADORA</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', border: '1px solid #000', marginRight: '32px'}}>
                    <div style={{ display:'flex', flexDirection: 'column', borderRight: '1px solid #000', padding: '10px' }}>
                      <span style={{ fontWeight: 'bold'}}>NOME EMPRESARIAL</span>
                      <span>{`${this.props.computer_name}`}</span>
                    </div>

                    <div style={{ display:'flex', flexDirection: 'column', width: '300px', padding: '10px'}}>
                      <span style={{ fontWeight: 'bold'}}>CNPJ</span>
                      <span>{`${this.props.computer_cnpj}`}</span>
                    </div>
                  </div>
                </tr>
                <div style={{ width: '100%', heigth: '20px'}}>
                  <span style={{visibility: 'hidden'}}>teste</span>
                </div>


                <tr>
                  <div style={{ display: 'flex', width: '100%', heigth: '10px'}}>
                    <div style={{ display: 'flex', width: '98%', heigth: '10px'}}>
                     <span style={{ fontWeight: 'bold'}}>2. PESSOA JURÍDICA BENEFICIÁRIA DOS RENDIMENTO</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', border: '1px solid #000', marginRight: '32px'}}>
                    <div style={{ display:'flex', flexDirection: 'column', borderRight: '1px solid #000', padding: '10px' }}>
                      <span style={{ fontWeight: 'bold'}}>NOME EMPRESARIAL</span>
                      <span>{`${this.props.company}`}</span>
                    </div>

                    <div style={{ display:'flex', flexDirection: 'column', width: '300px', padding: '10px'}}>
                      <span style={{ fontWeight: 'bold'}}>CNPJ</span>
                      <span>{`${cnpjOrCpfFormated}`}</span>
                    </div>
                  </div>
                </tr>
                <div style={{ width: '100%', heigth: '20px'}}>
                  <span style={{visibility: 'hidden'}}>teste</span>
                </div>

                <tr>
                  <div style={{ display: 'flex', width: '100%', heigth: '10px'}}>
                    <div style={{ display: 'flex', width: '98%', heigth: '10px'}}>
                     <span style={{ fontWeight: 'bold'}}>2. RENDIMENTOS E IMPOSTO RETIDO NA FONTE</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', border: '1px solid #000', marginRight: '32px'}}>
                    <div style={{ display:'flex', flexDirection: 'column', borderRight: '1px solid #000', padding: '10px' }}>
                      <span style={{ fontWeight: 'bold'}}>MÊS</span>
                      <span>{`${this.props.month_payment.month} de ${this.props.month_payment?.year}`}</span>
                    </div>

                    <div style={{ display:'flex', flexDirection: 'column', borderRight: '1px solid #000', padding: '10px' }}>
                      <span style={{ fontWeight: 'bold'}}>CÓDIGO DE<br></br>RETENÇÃO</span>
                      <span>{`${this.props.irrf_code}`}</span>
                    </div>

                    <div style={{ display:'flex', flexDirection: 'column', borderRight: '1px solid #000', padding: '10px' }}>
                      <span style={{ fontWeight: 'bold'}}>DESCRIÇÃO DO RENDIMENTO</span>
                      <span>{`${this.props.company_object}`}</span>
                    </div>

                    <div style={{ display:'flex', flexDirection: 'column', borderRight: '1px solid #000', padding: '10px'}}>
                      <span style={{ fontWeight: 'bold'}}>RENDIMENTO R$</span>
                      <span>{`${fromCurrency.format(this.props.NF_value)}`}</span>
                    </div>

                    <div style={{ display:'flex', flexDirection: 'column', borderRight: '1px solid #000', padding: '10px'}}>
                      <span style={{ fontWeight: 'bold'}}>IMPOSTO RETIDO R$</span>
                      <span>{`${fromCurrency.format(this.props.NF_tax_value)}`}</span>
                    </div>
                  </div>
                </tr>
                <div style={{ width: '100%', heigth: '20px'}}>
                  <span style={{visibility: 'hidden'}}>teste</span>
                </div>
                
                <tr>
                  <div style={{ display: 'flex', width: '100%', heigth: '10px'}}>
                    <div style={{ display: 'flex', width: '98%', heigth: '10px'}}>
                     <span style={{ fontWeight: 'bold'}}>4. INFORMAÇÕES COMPLEMENTARES</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', border: '1px solid #000', marginRight: '32px', width: '700px', height: '300px'}}>
                    
                  </div>
                </tr>

              </tbody>
            </table>
          </div>
        </>
      );
    }
    
    else if(this.props.payment_type == 'simples' ) {
      return (
        <>
          <div className="relativeCSS">
            <style type="text/css" media="print">
            </style>
            <div className="flash" />
            <table className="testClass" style={{marginLeft: '60px', marginTop: '60px'}}>
              <thead>
                <div style={{ display: 'flex', border: '1px solid #000', marginRight: '32px', justifyContent: 'space-between'}}>
                  <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #000', padding: '10px' }}>
                    <span style={{ fontWeight: 'bold'}}>COMPETÊNCIA</span>
                    <span>{`${this.props.month_payment?.day} de ${this.props.month_payment.month} de ${this.props.month_payment?.year}`}</span>
                  </div>
                  <div style={{ width: '500px', textAlign: 'center'}}>
                    <span style={{ fontWeight: 'bold'}}>COMPROVANTE DE RENDIMENTOS PAGOS OU CREDITADOS E DE RETENÇÃO DE IMPOSTO DE RENDA NA FONTE – PESSOA JURÍDICA</span>
                  </div>
                </div>
              </thead>
              <div style={{ width: '100%', heigth: '20px'}}>
                <span style={{visibility: 'hidden'}}>teste</span>
              </div>

              <tbody>
                <tr>
                  <div style={{ display: 'flex', width: '100%', heigth: '10px'}}>
                    <div style={{ display: 'flex', width: '98%', heigth: '10px'}}>
                     <span style={{ fontWeight: 'bold'}}>1. FONTE PAGADORA</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', border: '1px solid #000', marginRight: '32px'}}>
                    <div style={{ display:'flex', flexDirection: 'column', borderRight: '1px solid #000', padding: '10px' }}>
                      <span style={{ fontWeight: 'bold'}}>NOME EMPRESARIAL</span>
                      <span>{`${this.props.computer_name}`}</span>
                    </div>

                    <div style={{ display:'flex', flexDirection: 'column', width: '300px', padding: '10px'}}>
                      <span style={{ fontWeight: 'bold'}}>CNPJ</span>
                      <span>{`${this.props.computer_cnpj}`}</span>
                    </div>
                  </div>
                </tr>
                <div style={{ width: '100%', heigth: '20px'}}>
                  <span style={{visibility: 'hidden'}}>teste</span>
                </div>


                <tr>
                  <div style={{ display: 'flex', width: '100%', heigth: '10px'}}>
                    <div style={{ display: 'flex', width: '98%', heigth: '10px'}}>
                     <span style={{ fontWeight: 'bold'}}>2. PESSOA JURÍDICA BENEFICIÁRIA DOS RENDIMENTO</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', border: '1px solid #000', marginRight: '32px'}}>
                    <div style={{ display:'flex', flexDirection: 'column', borderRight: '1px solid #000', padding: '10px' }}>
                      <span style={{ fontWeight: 'bold'}}>NOME EMPRESARIAL</span>
                      <span>{`${this.props.company}`}</span>
                    </div>

                    <div style={{ display:'flex', flexDirection: 'column', width: '300px', padding: '10px'}}>
                      <span style={{ fontWeight: 'bold'}}>CNPJ</span>
                      <span>{`${cnpjOrCpfFormated}`}</span>
                    </div>
                  </div>
                </tr>
                <div style={{ width: '100%', heigth: '20px'}}>
                  <span style={{visibility: 'hidden'}}>teste</span>
                </div>

                <tr>
                  <div style={{ display: 'flex', width: '100%', heigth: '10px'}}>
                    <div style={{ display: 'flex', width: '98%', heigth: '10px'}}>
                     <span style={{ fontWeight: 'bold'}}>2. RENDIMENTOS E IMPOSTO RETIDO NA FONTE</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', border: '1px solid #000', marginRight: '32px'}}>
                    <div style={{ display:'flex', flexDirection: 'column', borderRight: '1px solid #000', padding: '10px' }}>
                      <span style={{ fontWeight: 'bold'}}>MÊS</span>
                      <span>{`${this.props.month_payment.month} de ${this.props.month_payment?.year}`}</span>
                    </div>

                    <div style={{ display:'flex', flexDirection: 'column', borderRight: '1px solid #000', padding: '10px' }}>
                      <span style={{ fontWeight: 'bold'}}>CÓDIGO DE<br></br>RETENÇÃO</span>
                      <span>{`${this.props.payment_associate.calculation_basis == null ? '0' : this.props.irrf_code}`}</span>
                    </div>

                    <div style={{ display:'flex', flexDirection: 'column', borderRight: '1px solid #000', padding: '10px' }}>
                      <span style={{ fontWeight: 'bold'}}>DESCRIÇÃO DO RENDIMENTO</span>
                      <span>{`${this.props.company_object}`}</span>
                    </div>

                    <div style={{ display:'flex', flexDirection: 'column', borderRight: '1px solid #000', padding: '10px'}}>
                      <span style={{ fontWeight: 'bold'}}>RENDIMENTO R$</span>
                      <span>{`${fromCurrency.format(this.props.calculate_basis)}`}</span>
                    </div>

                    <div style={{ display:'flex', flexDirection: 'column', borderRight: '1px solid #000', padding: '10px'}}>
                      <span style={{ fontWeight: 'bold'}}>IMPOSTO RETIDO R$</span>
                      <span>{`${this.props.payment_associate.calculation_basis == null ? '0' : fromCurrency.format(this.props.payment_associate.withheld_tax)}`}</span>
                    </div>
                  </div>
                </tr>
                <div style={{ width: '100%', heigth: '20px'}}>
                  <span style={{visibility: 'hidden'}}>teste</span>
                </div>
                
                <tr>
                  <div style={{ display: 'flex', width: '100%', heigth: '10px'}}>
                    <div style={{ display: 'flex', width: '98%', heigth: '10px'}}>
                     <span style={{ fontWeight: 'bold'}}>4. INFORMAÇÕES COMPLEMENTARES</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', border: '1px solid #000', marginRight: '32px', width: '700px', height: '300px'}}>
                    
                  </div>
                </tr>

              </tbody>
            </table>
          </div>
        </>
      );
    }
  }
}

export const FunctionalTemplateDoubleReciboExtratoCompany = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len
  return <TemplateDoubleRecibo ref={ref} text={props.text} payment_id={props.payment_id}
  city={props.city} UF={props.UF} company={props.company} cnpj_company={props.cnpj_company} computer_name={props.computer_name}
  NF_value={props.NF_value} NF_index={props.NF_index} NF_tax_value={props.NF_tax_value} prefecture_cnpj={props.prefecture_cnpj}
  NF_liquid_value={props.NF_liquid_value} user_name={props.user_name} registration={props.registration} computer_cnpj={props.computer_cnpj}
  month_payment={props.month_payment} tax_note={props.tax_note} calculate_basis={props.calculate_basis} payment_associate={props.payment_associate}
  company_object={props.company_object} iss_item={props.iss_item} irrf_code={props.irrf_code} payment_type={props.payment_type} user_secretary={props.user_secretary}
  />;
});
