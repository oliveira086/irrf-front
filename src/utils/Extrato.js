import * as React from "react";
import extensiveNumber from 'numero-por-extenso';

export class TemplateDoubleRecibo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { checked: false };
  }

  handleCheckboxOnChange = () =>
    this.setState({ checked: !this.state.checked });

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
              <thead style={{display:'flex', flexDirection: 'column'}}>
                <div style={{ display: 'flex', width: '100%', heigth: '10px'}}>
                  <div style={{ display: 'flex', width: '100%', heigth: '10px', borderRadius: '6px', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center'}}>{`TERMO DE NOTIFICAÇÃO DE LANÇAMENTO: Nº ${this.props.payment_id}`}</div>
                </div>
                <div style={{ display: 'flex', width: '100%', heigth: '10px'}}>
                  <div style={{ display: 'flex', width: '100%', heigth: '10px', borderRadius: '6px'}}>{`CONTRIBUINTE: ${this.props.company}`}</div>
                </div>
                <div style={{ display: 'flex', width: '100%', heigth: '10px'}}>
                  <div style={{ display: 'flex', width: '100%', heigth: '10px', borderRadius: '6px'}}>{`CNPJ: ${cnpjOrCpfFormated}`}</div>
                </div>
              </thead>
              <tr />
              <tr />
              <tr />
              <tr />
              <tbody>
                <tr>
                  <div style={{ display: 'flex', width: '100%', heigth: '10px'}}>
                    <div style={{ display: 'flex', width: '98%', justifyContent: 'center', alignItems: 'center', heigth: '10px'}}>
                      {`Em 14 de abril de 2023, no exercício das atribuições inerentes ao poder de polícia 
  administrativa tributária deste município, NOTIFICA-SE vossa senhoria para tomar 
  conhecimento a respeito do lançamento do Imposto de Renda Retido e do Imposto
  Sobre Serviço Retido, ambos a serem retidos na fonte, pertinente ao contribuinte supracitado.`}
                    </div>
                  </div>
                </tr>
  
                <tr/>
                <tr/>
                <tr />
                <tr />
                <tr>
                  <span style={{fontWeight: 'bold'}}>1. DADOS DA INCIDÊNCIA</span><br></br>
                </tr>
                <tr >
                  <div style={{ display: 'flex', flexDirection: 'column', width: '98%', heigth: '10px', paddingLeft: '10px'}}>
                    <span>1.1 Município: {`${this.props.city}`}</span>
                    <span>1.2 CNPJ: {`${this.props.prefecture_cnpj}`}</span>
                    <span>1.3 Ordenador de Despesas: {`${this.props.computer_name}`}</span>
                    <span>1.4 CNPJ: {`${this.props.computer_cnpj}`}</span>
                    <span>1.5 Competência: {`${this.props.month_payment.month} de ${this.props.month_payment.year}`}</span>
                    <span>1.6 Nota Fiscal: {`${this.props.tax_note.split('-')[0]}`}</span>
                    <span>1.7 Valor do Crédito/Pagamento: {`${fromCurrency.format(this.props.NF_value)}`}</span>
                  </div>
                </tr>
                <tr/>
                <tr/>
                <tr />
                <tr />
                <tr>
                  <span style={{fontWeight: 'bold'}}>2. MEMÓRIA DE CÁLCULO RETENÇÃO</span><br></br>
                </tr>
                <tr/>
                <tr/>
                <tr />
                <tr />
                <tr >
                  <div style={{ display: 'flex', flexDirection: 'column', width: '98%', heigth: '10px', paddingLeft: '10px'}}>
                    <span style={{fontWeight: 'bold'}}>2.1 IMPOSTO DE RENDA RETIDO NA FONTE</span>
                  </div>
                </tr>
                <tr >
                  <div style={{ display: 'flex', flexDirection: 'column', width: '98%', heigth: '10px', paddingLeft: '20px'}}>
                    <span>2.1.1 Fato gerador IRRF : Crédito / Pagamento</span>
                    <span>2.1.2 Código: {`${this.props.irrf_code}`}</span>
                    <span>2.1.3 Base de cálculo da retenção IRRF: {`${fromCurrency.format(this.props.calculate_basis)}`}</span>
                    <span>2.1.4 Alíquota Sobre IRRF: {`${this.props.NF_index}`}%</span>
                    <span>2.1.5 Valor do IRRF: {`${fromCurrency.format(this.props.NF_tax_value)}`}</span>
                  </div>
                </tr>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr >
                <div style={{ display: 'flex', flexDirection: 'column', width: '98%', heigth: '10px', paddingLeft: '10px'}}>
                  <span style={{fontWeight: 'bold'}}>2.2 IMPOSTO SOBRE SERVIÇO RETIDO NA FONTE</span>
                </div>
                </tr>
                <tr >
                  <div style={{ display: 'flex', flexDirection: 'column', width: '98%', heigth: '10px', paddingLeft: '20px'}}>
                    <span>2.2.1 Fato gerador ISSRF: {this.props.payment_associate.calculation_basis == null ? '' : this.props.company_object}</span>
                    <span>2.2.2 Item Serviço: {`${this.props.payment_associate.calculation_basis == null ? '' : this.props.iss_item.split(' ')[0]}`}</span>
                    <span>2.2.3 Base de cálculo da retenção ISSRF: {`${this.props.payment_associate.calculation_basis == null ? '' : fromCurrency.format(this.props.payment_associate.calculation_basis)}`}</span>
                    <span>2.2.4 Alíquota Sobre ISSRF: {`${this.props.payment_associate.calculation_basis == null ? '' : this.props.payment_associate.index}`}%</span>
                    <span>2.2.5 Valor do ISSRF: {`${this.props.payment_associate.calculation_basis == null ? '' : fromCurrency.format(this.props.payment_associate.withheld_tax)}`}</span>
                  </div>
                </tr>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr >
                  <div style={{ display: 'flex', flexDirection: 'column', width: '98%', heigth: '10px', paddingLeft: '10px'}}>
                    <span style={{fontWeight: 'bold'}}>3. AUTUAÇÃO</span>
                  </div>
                </tr>
                <tr>
                  <div style={{ display: 'flex', width: '100%', heigth: '10px'}}>
                    <div style={{ display: 'flex', width: '98%', justifyContent: 'center', alignItems: 'center', heigth: '10px'}}>
                      {`Desta forma, fica o(a) ordenador(a) de despesa ciente acerca de que o valor de 
  ${fromCurrency.format(Number(this.props.NF_tax_value) + Number(this.props.payment_associate.withheld_tax))} (${extensiveNumber.porExtenso( (Number(this.props.NF_tax_value) + Number(this.props.payment_associate.withheld_tax)), extensiveNumber.estilo.monetario)}), representado pelo documento 
  fiscal de arrecadação em anexo, deverá ser retido do pagamento do fornecedor acima 
  identificado, a título de pagamento do Imposto de Renda Retido na fonte e Imposto Sobre 
  Serviço Retido na fonte.`}
                      <br></br>
                    </div>
                  </div>
                </tr>
                <div style={{ width: '100%', heigth: '20px'}}>
                  <span style={{visibility: 'hidden'}}>teste</span>
                </div>
                <tr>
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%', heigth: '10px', justifyContent: 'center', alignItems: 'center'}}>
                    <div style={{ width: '60%', heigth: '1px', background: '#000', border: '0.5px solid #000'}}></div>
                    <span>{this.props.user_name}</span>
                    <span>{this.props.registration}</span>
                    <span>{this.props.user_secretary}</span>
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
              <thead style={{display:'flex', flexDirection: 'column'}}>
                <div style={{ display: 'flex', width: '100%', heigth: '10px'}}>
                  <div style={{ display: 'flex', width: '100%', heigth: '10px', borderRadius: '6px', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center'}}>{`TERMO DE NOTIFICAÇÃO DE LANÇAMENTO: Nº ${this.props.payment_id}`}</div>
                </div>
                <div style={{ display: 'flex', width: '100%', heigth: '10px'}}>
                  <div style={{ display: 'flex', width: '100%', heigth: '10px', borderRadius: '6px'}}>{`CONTRIBUINTE: ${this.props.company}`}</div>
                </div>
                <div style={{ display: 'flex', width: '100%', heigth: '10px'}}>
                  <div style={{ display: 'flex', width: '100%', heigth: '10px', borderRadius: '6px'}}>{`CNPJ: ${cnpjOrCpfFormated}`}</div>
                </div>
              </thead>
              <tr />
              <tr />
              <tr />
              <tr />
              <tbody>
                <tr>
                  <div style={{ display: 'flex', width: '100%', heigth: '10px'}}>
                    <div style={{ display: 'flex', width: '98%', justifyContent: 'center', alignItems: 'center', heigth: '10px'}}>
                      {`Em 14 de abril de 2023, no exercício das atribuições inerentes ao poder de polícia 
  administrativa tributária deste município, NOTIFICA-SE vossa senhoria para tomar 
  conhecimento a respeito do lançamento do Imposto de Renda Retido e do Imposto
  Sobre Serviço Retido, ambos a serem retidos na fonte, pertinente ao contribuinte supracitado.`}
                    </div>
                  </div>
                </tr>
  
                <tr/>
                <tr/>
                <tr />
                <tr />
                <tr>
                  <span style={{fontWeight: 'bold'}}>1. DADOS DA INCIDÊNCIA</span><br></br>
                </tr>
                <tr >
                  <div style={{ display: 'flex', flexDirection: 'column', width: '98%', heigth: '10px', paddingLeft: '10px'}}>
                    <span>1.1 Município: {`${this.props.city}`}</span>
                    <span>1.2 CNPJ: {`${this.props.prefecture_cnpj}`}</span>
                    <span>1.3 Ordenador de Despesas: {`${this.props.computer_name}`}</span>
                    <span>1.4 CNPJ: {`${this.props.computer_cnpj}`}</span>
                    <span>1.5 Competência: {`${this.props.month_payment.month} de ${this.props.month_payment.year}`}</span>
                    <span>1.6 Nota Fiscal: {`${this.props.tax_note.split('-')[0]}`}</span>
                    <span>1.7 Valor do Crédito/Pagamento: {`${fromCurrency.format(this.props.NF_value)}`}</span>
                  </div>
                </tr>
                <tr/>
                <tr/>
                <tr />
                <tr />
                <tr>
                  <span style={{fontWeight: 'bold'}}>2. MEMÓRIA DE CÁLCULO RETENÇÃO</span><br></br>
                </tr>
                <tr/>
                <tr/>
                <tr />
                <tr />
                <tr >
                  <div style={{ display: 'flex', flexDirection: 'column', width: '98%', heigth: '10px', paddingLeft: '10px'}}>
                    <span style={{fontWeight: 'bold'}}>2.1 IMPOSTO SOBRE SERVIÇO RETIDO NA FONTE</span>
                  </div>
                </tr>
                <tr >
                  <div style={{ display: 'flex', flexDirection: 'column', width: '98%', heigth: '10px', paddingLeft: '20px'}}>
                    <span>2.1.1 Fato gerador ISSRF: {this.props.company_object}</span>
                    <span>2.1.2 Item Serviço: {`${this.props?.iss_item?.split(' ')[0]}`}</span>
                    <span>2.1.3 Base de cálculo da retenção IRRF: {`${fromCurrency.format(this.props.calculate_basis)}`}</span>
                    <span>2.1.4 Alíquota Sobre ISSRF: {`${this.props.NF_index}`}%</span>
                    <span>2.1.5 Valor do ISSRF: {`${fromCurrency.format(this.props.NF_tax_value)}`}</span>
                  </div>
                </tr>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr >
                <div style={{ display: 'flex', flexDirection: 'column', width: '98%', heigth: '10px', paddingLeft: '10px'}}>
                  <span style={{fontWeight: 'bold'}}>2.2 IMPOSTO DE RENDA RETIDO NA FONTE</span>
                </div>
                </tr>
                <tr >
                  <div style={{ display: 'flex', flexDirection: 'column', width: '98%', heigth: '10px', paddingLeft: '20px'}}>
                    <span>2.2.1 Fato gerador IRRF : Crédito / Pagamento</span>
                    <span>2.2.2 Código: {`${this.props.payment_associate.calculation_basis == null ? '0' : this.props.irrf_code}`}</span>
                    <span>2.2.3 Base de cálculo da retenção ISSRF: {`${this.props.payment_associate.calculation_basis == null ? '0' : fromCurrency.format(this.props.payment_associate.calculation_basis)}`}</span>
                    <span>2.2.4 Alíquota Sobre IRRF: {`${this.props.payment_associate.calculation_basis == null ? '0' : this.props.payment_associate.index}`}%</span>
                    <span>2.2.5 Valor do IRRF: {`${this.props.payment_associate.calculation_basis == null ? '0' : fromCurrency.format(this.props.payment_associate.withheld_tax)}`}</span>
                  </div>
                </tr>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr >
                  <div style={{ display: 'flex', flexDirection: 'column', width: '98%', heigth: '10px', paddingLeft: '10px'}}>
                    <span style={{fontWeight: 'bold'}}>3. AUTUAÇÃO</span>
                  </div>
                </tr>
                <tr>
                  <div style={{ display: 'flex', width: '100%', heigth: '10px'}}>
                    <div style={{ display: 'flex', width: '98%', justifyContent: 'center', alignItems: 'center', heigth: '10px'}}>
                      {`Desta forma, fica o(a) ordenador(a) de despesa ciente acerca de que o valor de 
  ${fromCurrency.format(Number(this.props.NF_tax_value) + Number(this.props.payment_associate.withheld_tax))} (${extensiveNumber.porExtenso( (Number(this.props.NF_tax_value) + Number(this.props.payment_associate.withheld_tax)), extensiveNumber.estilo.monetario)}), representado pelo documento 
  fiscal de arrecadação em anexo, deverá ser retido do pagamento do fornecedor acima 
  identificado, a título de pagamento do Imposto de Renda Retido na fonte e Imposto Sobre 
  Serviço Retido na fonte.`}
                    </div>
                  </div>
                </tr>
                <div style={{ width: '100%', heigth: '20px'}}>
                  <span style={{visibility: 'hidden'}}>teste</span>
                </div>
                <tr>
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%', heigth: '10px', justifyContent: 'center', alignItems: 'center'}}>
                    <div style={{ width: '60%', heigth: '1px', background: '#000', border: '0.5px solid #000'}}></div>
                    <span>{this.props.user_name}</span>
                    <span>{this.props.registration}</span>
                    <span>{this.props.user_secretary}</span>
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

export const FunctionalTemplateDoubleRecibo = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len
  return <TemplateDoubleRecibo ref={ref} text={props.text} payment_id={props.payment_id}
  city={props.city} UF={props.UF} company={props.company} cnpj_company={props.cnpj_company} computer_name={props.computer_name}
  NF_value={props.NF_value} NF_index={props.NF_index} NF_tax_value={props.NF_tax_value} prefecture_cnpj={props.prefecture_cnpj}
  NF_liquid_value={props.NF_liquid_value} user_name={props.user_name} registration={props.registration} computer_cnpj={props.computer_cnpj}
  month_payment={props.month_payment} tax_note={props.tax_note} calculate_basis={props.calculate_basis} payment_associate={props.payment_associate}
  company_object={props.company_object} iss_item={props.iss_item} irrf_code={props.irrf_code} payment_type={props.payment_type} user_secretary={props.user_secretary}
  />;
});
