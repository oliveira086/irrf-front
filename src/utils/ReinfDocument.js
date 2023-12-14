import * as React from "react";
import extensiveNumber from 'numero-por-extenso';

export class TemplateReinfDocument extends React.PureComponent {
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

    return (
      <>
        <div className="relativeCSS">
          <style type="text/css" media="print">
          </style>
          <div className="flash" />
          <table className="testClass" style={{width: '560px', marginLeft: '60px', marginTop: '60px'}}>
            <thead style={{display:'flex', flexDirection: 'column'}}>
              <div style={{ display: 'flex', width: '100%', heigth: '10px', marginBottom: '12px'}}>
                <div style={{ display: 'flex', heigth: '10px', borderRadius: '6px', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center'}}>{`Comprovante de Transmissão EFD-REINF`}</div>
              </div>
              <div style={{ display: 'flex', width: '100%', heigth: '10px'}}>
                <div style={{ display: 'flex', heigth: '10px', borderRadius: '6px', fontWeight: 'bold'}}>{`Municipio:`}</div>
                <div style={{ marginLeft: '8px'}}>{this.props.cityName}</div>
              </div>

              <div style={{ display: 'flex', width: '100%', heigth: '10px'}}>
                <div style={{ display: 'flex', heigth: '10px', borderRadius: '6px', fontWeight: 'bold'}}>{`CNPJ Municipio:`}</div>
                <div style={{ marginLeft: '8px'}}>{this.props.cityCnpj}</div>
              </div>

              <div style={{ display: 'flex', width: '100%', heigth: '10px'}}>
                <div style={{ display: 'flex', heigth: '10px', borderRadius: '6px', fontWeight: 'bold'}}>{`Nota Fiscal:`}</div>
                <div style={{ marginLeft: '8px'}}>{this.props?.notafiscal?.split('-')[0]}</div>
              </div>
              <tr />
              <tr />
              <tr />
              <tr />
              <tr />
              <tr />
              <tr />
              <tr />
              <div style={{ display: 'flex', width: '100%', heigth: '10px'}}>
                <div style={{ display: 'flex', heigth: '10px', borderRadius: '6px', fontWeight: 'bold'}}>{`Protocolo RFB:`}</div>
                <div style={{ marginLeft: '8px'}}>{this.props.protocolo}</div>
              </div>
              <div style={{ display: 'flex', width: '100%', heigth: '10px'}}>
                <div style={{ display: 'flex', heigth: '10px', borderRadius: '6px', fontWeight: 'bold'}}>{`CNPJ Unidade Orçamentária:`}</div>
                <div style={{ marginLeft: '8px'}}>{this.props.cnpjOrdenador}</div>
              </div>
              <div style={{ display: 'flex', width: '100%', heigth: '10px'}}>
                <div style={{ display: 'flex', heigth: '10px', borderRadius: '6px', fontWeight: 'bold'}}>{`Competência Envio:`}</div>
                <div style={{ marginLeft: '8px'}}>{this.props.competencia}</div>
              </div>

            </thead>
            <tbody>
              <div style={{ display: 'flex', width: '100%', heigth: '10px'}}>
                <div style={{ display: 'flex', heigth: '10px', borderRadius: '6px', fontWeight: 'bold'}}>{`Fornecedor:`}</div>
                <div style={{ marginLeft: '8px'}}>{this.props.company_name}</div>
              </div>

              <div style={{ display: 'flex', width: '100%', heigth: '10px'}}>
                <div style={{ display: 'flex', heigth: '10px', borderRadius: '6px', fontWeight: 'bold'}}>{`CNPJ Fornecedor:`}</div>
                <div style={{ marginLeft: '8px'}}>{this.props.cnpjFornecedor}</div>
              </div>
              <div style={{ display: 'flex', width: '100%', heigth: '10px'}}>
                <div style={{ display: 'flex', heigth: '10px', borderRadius: '6px', fontWeight: 'bold'}}>{`Valor do Crédito:`}</div>
                <div style={{ marginLeft: '8px'}}>{fromCurrency.format(this.props.value)}</div>
              </div>
              <div style={{ display: 'flex', width: '100%', heigth: '10px'}}>
                <div style={{ display: 'flex', heigth: '10px', borderRadius: '6px', fontWeight: 'bold'}}>{`Valor do IR:`}</div>
                <div style={{ marginLeft: '8px'}}>{fromCurrency.format(this.props.IRValue)}</div>
              </div>

              <tr>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', heigth: '10px', justifyContent: 'left', alignItems: 'start'}}>
                  <div style={{ width: '60%', heigth: '1px', background: '#000'}}></div><br></br>
                  <span>Responsabilidade técnica pela elaboração deste documento:</span><br/>
                  <span>Wlisses Menezes Sociedade Individual de Advocacia. OAB/PE Nº 1969</span>
                  <span>Rua coelho Rodrigues, Nº 696, Centro Araripina PE - CEP: 56.280-000</span>
                  <span>WhatsApp: 0800 591 5366</span>
                </div>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

export const FunctionalTemplateReinfDocument = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len
  return <TemplateReinfDocument ref={ref} text={props.text} protocolo={props.protocolo} cnpjFornecedor={props.cnpjFornecedor}
  cnpjOrdenador={props.cnpjOrdenador} company_name={props.company_name} ordenadorName={props.ordenadorName} cityName={props.cityName}
  cityCnpj={props.cityCnpj} notafiscal={props.notafiscal} competencia={props.competencia} value={props.value} IRValue={props.IRValue}
  />;
});
 