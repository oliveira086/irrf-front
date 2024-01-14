import * as React from "react";
import LogoEscritorio from '../assets/images/logo-escritorio.jpeg'

export class DespachoTemplate extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { checked: false };
  }

  handleCheckboxOnChange = () =>
    this.setState({ checked: !this.state.checked });

  setRef = (ref) => (this.canvasEl = ref);

  render() {
    const { text } = this.props;

    console.log(this.props);
    
    let fromCurrency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
    let cnpjOrCpfFormated;
    if(this.props.cnpj_company.length > 11) {
      cnpjOrCpfFormated = this.props.cnpj_company.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    } else {
      cnpjOrCpfFormated = this.props.cnpj_company.replace(/^(\d{3})(\d{3})(\d{3})/, "$1.$2.$3-")
    }

    if(this.props.payment_type === 'ordinario') {
      return (
        <>
          <div className="relativeCSS">
            <style type="text/css" media="print">
            </style>
            <div className="flash" />
            <table className="testClass" style={{marginLeft: '60px', marginTop: '60px'}}>
              <div>
                <img src={LogoEscritorio} style={{ width: '300px'}} />
              </div>
              <thead style={{ display:'flex', flexDirection: 'column', alingItems: 'flex-start', justifyContent: 'center', marginTop: '16px'}}>
                <div style={{ display: 'flex', width: '100%', heigth: '10px', justifyContent: 'flex-start'}}>
                  <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', width: '200px', heigth: '10px'}}>{`DESPACHO Nº: ${this.props.payment_id}`}</div>
                </div>
              </thead>
              <tbody>
                <tr>
                  <span style={{fontWeight: 'bold'}}>1. Dados do pagador</span><br></br>
                </tr>
                <tr/>
                <tr/>
                <tr>
                  <span style={{fontWeight: 'bold'}}>Municipio: </span>
                  <span style={{fontWeight: 'semibold'}}>{`Prefeitura Municipal de ${this.props.city} - ${this.props.UF}`}</span>
                </tr>
                <tr>
                  <span style={{fontWeight: 'bold'}}>CNPJ: </span>
                  <span style={{fontWeight: 'semibold'}}>{this.props.prefecture_cnpj}</span>
                </tr>
                <tr>
                  <span style={{fontWeight: 'bold'}}>Ordenador de despesa: </span>
                  <span style={{fontWeight: 'semibold'}}>{this.props.computer_name}</span>
                </tr>
                <tr>
                  <span style={{fontWeight: 'bold'}}>CNPJ: </span>
                  <span style={{fontWeight: 'semibold'}}>{this.props.computer_cnpj}</span>
                </tr>
                <tr>
                  <span style={{fontWeight: 'bold'}}>Nota Fiscal: </span>
                  <span style={{fontWeight: 'semibold'}}>{`${this.props.tax_note.split('-')[0]} - ${this.props.tax_note.split('-')[2]}`}</span>
                </tr>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr>
                  <span style={{fontWeight: 'bold'}}>2. Dados do fornecedor</span><br></br> 
                </tr>
                <tr>
                  <span style={{fontWeight: 'bold'}}>Nome/Razão Social: </span>
                  <span style={{fontWeight: 'semibold'}}>{`${this.props.company}`}</span>
                </tr>
                <tr>
                  <span style={{fontWeight: 'bold'}}>CNPJ: </span>
                  <span style={{fontWeight: 'semibold'}}>{`${cnpjOrCpfFormated}`} </span>
                </tr>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr>
                  <span style={{fontWeight: 'bold'}}>3. Dados Fiscais/Financeiros</span><br></br> 
                </tr>
                <tr>
                  <span style={{fontWeight: 'bold'}}>Valor Crédito/pagamento: </span>
                  <span style={{fontWeight: 'semibold'}}>{`${fromCurrency.format(this.props.NF_value)}`} </span>
                </tr>
                <tr>
                  <span style={{fontWeight: 'bold'}}>Código Receita: </span>
                  <span style={{fontWeight: 'semibold'}}>{this.props.irrf_code}</span>
                </tr>
                {this.props.payment_associate.id == null ? <></> :
                  <tr>
                    <span style={{fontWeight: 'bold'}}>Item: </span>
                    <span style={{fontWeight: 'semibold'}}>{this.props.payment_associate?.iss_item?.split(' ')[0]}</span>
                  </tr>
                }
                
                <tr>
                  <span style={{fontWeight: 'bold'}}>Valor do IRRF: </span>
                  <span style={{fontWeight: 'semibold'}}>{fromCurrency.format(this.props?.NF_tax_value)}</span>
                </tr>
                {this.props.payment_associate.id == null ? <></> :
                  <tr>
                    <span style={{fontWeight: 'bold'}}>Valor do ISS: </span>
                    <span style={{fontWeight: 'semibold'}}>{fromCurrency.format(this.props.payment_associate?.withheld_tax)}</span>
                  </tr>
                }

                {
                  this.props.associate_validation == false ? 
                  <tr>
                    <span style={{fontWeight: 'bold'}}>Saldo Pagador: </span>
                    <span style={{fontWeight: 'semibold'}}>{fromCurrency.format(this.props.NF_liquid_value)} </span>
                  </tr>
                  :
                  <tr>
                    <span style={{fontWeight: 'bold'}}>Saldo Pagador: </span>
                    <span style={{fontWeight: 'semibold'}}>{fromCurrency.format( Number(this.props.NF_value) - (Number(this.props.payment_associate?.withheld_tax) + Number(this.props?.NF_tax_value) )   )} </span>
                  </tr>
                }
                
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr>
                  <span style={{fontWeight: 'bold'}}>Competência</span><br></br>
                  <div style={{width: '180px', heigth: '10px', border: '2px solid #000', borderRadius: '6px', padding: '6px'}}>
                    <span>{`${this.props.month_payment.month} de ${this.props.month_payment.year}`}</span>
                  </div>
                </tr>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr>
                  <span style={{fontWeight: 'bold'}}>{`DESPACHO Nº ${this.props.payment_id}`}</span><br></br>
                </tr>
                <tr/>
                <tr/>
                <tr>
                  <span>{`De acordo, encaminhe-se ao setor competente, com as memórias de cálculo de retenção tributária, aos quais servirão de referência para a realização de empenho, liquidação e pagamento.`}</span><br></br>
                </tr>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/> 
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr>
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%', heigth: '10px', justifyContent: 'center', alignItems: 'center'}}>
                    <br></br><br/><div style={{ width: '60%', heigth: '1px', background: '#000', border: '0.5px solid #000'}}></div><br/>
                    <span style={{fontWeight: 'regular'}}>{`${this.props.city} - ${this.props.UF}, ${this.props.month_payment?.day} de ${this.props.month_payment.month} de ${this.props.month_payment.year} `} </span>
                  </div>
                </tr>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
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
    } else {
      return (
        <>
          <div className="relativeCSS">
            <style type="text/css" media="print">
            </style>
            <div className="flash" />
            <table className="testClass" style={{marginLeft: '60px', marginTop: '60px'}}>
              <thead style={{display:'flex', flexDirection: 'column', alingItems: 'flex-start', justifyContent: 'center'}}>
                <div style={{ display: 'flex', width: '100%', heigth: '10px', justifyContent: 'flex-start'}}>
                  <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', width: '200px', heigth: '10px'}}>{`DESPACHO Nº: ${this.props.payment_id}`}</div>
                </div>
              </thead>
              <tbody>
                <tr>
                  <span style={{fontWeight: 'bold'}}>1. Dados do pagador</span><br></br>
                </tr>
                <tr/>
                <tr/>
                <tr>
                  <span style={{fontWeight: 'bold'}}>Municipio: </span>
                  <span style={{fontWeight: 'semibold'}}>{`Prefeitura Municipal de ${this.props.city} - ${this.props.UF}`}</span>
                </tr>
                <tr>
                  <span style={{fontWeight: 'bold'}}>CNPJ: </span>
                  <span style={{fontWeight: 'semibold'}}>{this.props.prefecture_cnpj}</span>
                </tr>
                <tr>
                  <span style={{fontWeight: 'bold'}}>Ordenador de despesa: </span>
                  <span style={{fontWeight: 'semibold'}}>{this.props.computer_name}</span>
                </tr>
                <tr>
                  <span style={{fontWeight: 'bold'}}>CNPJ: </span>
                  <span style={{fontWeight: 'semibold'}}>{this.props.computer_cnpj}</span>
                </tr>
                <tr>
                  <span style={{fontWeight: 'bold'}}>Nota Fiscal: </span>
                  <span style={{fontWeight: 'semibold'}}>{`${this.props.tax_note.split('-')[0]} - ${this.props.tax_note.split('-')[2]}`}</span>
                </tr>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr>
                  <span style={{fontWeight: 'bold'}}>2. Dados do fornecedor</span><br></br> 
                </tr>
                <tr>
                  <span style={{fontWeight: 'bold'}}>Nome/Razão Social: </span>
                  <span style={{fontWeight: 'semibold'}}>{`${this.props.company}`}</span>
                </tr>
                <tr>
                  <span style={{fontWeight: 'bold'}}>CNPJ: </span>
                  <span style={{fontWeight: 'semibold'}}>{`${cnpjOrCpfFormated}`} </span>
                </tr>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr>
                  <span style={{fontWeight: 'bold'}}>3. Dados Fiscais/Financeiros</span><br></br> 
                </tr>
                <tr>
                  <span style={{fontWeight: 'bold'}}>Valor Crédito/pagamento: </span>
                  <span style={{fontWeight: 'semibold'}}>{`${fromCurrency.format(this.props.NF_value)}`} </span>
                </tr>
                <tr>
                  <span style={{fontWeight: 'bold'}}>Item: </span>
                  <span style={{fontWeight: 'semibold'}}>{this.props.payment_associate?.iss_item?.split(' ')[0]}</span>
                </tr>

                {this.props.associate_validation == false ? <></> :
                  <tr>
                    <span style={{fontWeight: 'bold'}}>Código Receita: </span>
                    <span style={{fontWeight: 'semibold'}}>{this.props.irrf_code}</span>
                  </tr>
                }
                
                <tr>
                    <span style={{fontWeight: 'bold'}}>Valor do ISS: </span>
                    <span style={{fontWeight: 'semibold'}}>{fromCurrency.format(this.props?.NF_tax_value)}</span>
                  </tr>

                
                {this.props.associate_validation == false ? <></> :
                  <tr>
                    <span style={{fontWeight: 'bold'}}>Valor do IRRF: </span>
                    <span style={{fontWeight: 'semibold'}}>{fromCurrency.format(this.props.payment_associate?.withheld_tax)}</span>
                  </tr>
                }

                {
                  this.props.associate_validation == false ? 
                  <tr>
                    <span style={{fontWeight: 'bold'}}>Saldo Pagador: </span>
                    <span style={{fontWeight: 'semibold'}}>{fromCurrency.format(this.props.NF_liquid_value)} </span>
                  </tr>
                  :
                  <tr>
                    <span style={{fontWeight: 'bold'}}>Saldo Pagador: </span>
                    <span style={{fontWeight: 'semibold'}}>{fromCurrency.format( Number(this.props.NF_value) - (Number(this.props.payment_associate?.withheld_tax) + Number(this.props?.NF_tax_value) )   )} </span>
                  </tr>
                }

                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr>
                  <span style={{fontWeight: 'bold'}}>Competência</span><br></br>
                  <div style={{width: '180px', heigth: '10px', border: '2px solid #000', borderRadius: '6px', padding: '6px'}}>
                    <span>{`${this.props.month_payment.month} de ${this.props.month_payment.year}`}</span>
                  </div>
                </tr>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr>
                  <span style={{fontWeight: 'bold'}}>{`DESPACHO Nº ${this.props.payment_id}`}</span><br></br>
                </tr>
                <tr/>
                <tr/>
                <tr>
                  <span>{`De acordo, encaminhe-se ao setor competente, com as memórias de cálculo de retenção tributária, aos quais servirão de referência para a realização de empenho, liquidação e pagamento.`}</span><br></br>
                </tr>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/> 
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr>
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%', heigth: '10px', justifyContent: 'center', alignItems: 'center'}}>
                    <br></br><br/><div style={{ width: '60%', heigth: '1px', background: '#000', border: '0.5px solid #000'}}></div><br/>
                    <span style={{fontWeight: 'regular'}}>{`${this.props.city} - ${this.props.UF}, ${this.props.month_payment?.day} de ${this.props.month_payment.month} de ${this.props.month_payment.year} `} </span>
                  </div>
                </tr>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr/>
                <tr>
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%', heigth: '10px', justifyContent: 'left', alignItems: 'start'}}>
                    <div style={{ width: '60%', heigth: '1px', background: '#000'}}></div><br></br>
                    <span>Responsabilidade técnica pela elaboração deste documento:</span>
                    <span>Wlisses Menezes Sociedade Individual de Advocacia. OAB/PE n 1969</span>
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

export const FunctionalDespachoTemplate = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len
  return <DespachoTemplate ref={ref} text={props.text} />;
});
