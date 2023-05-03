import * as React from "react";

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
    let cnpjOrCpfFormated;
    if(this.props.cnpj_company.length > 11) {
      cnpjOrCpfFormated = this.props.cnpj_company.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    } else {
      cnpjOrCpfFormated = this.props.cnpj_company.replace(/^(\d{3})(\d{3})(\d{3})/, "$1.$2.$3-")
    }

    return (
      <>
        <div className="relativeCSS">
          <style type="text/css" media="print">
          </style>
          <div className="flash" />
          <table className="testClass" style={{ marginLeft: '60px', marginTop: '60px'}}>
            <thead style={{display:'flex', flexDirection: 'column', alingItems: 'flex-start', justifyContent: 'center'}}>
              <div style={{ display: 'flex', width: '100%', heigth: '10px', justifyContent: 'flex-start'}}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', width: '200px', heigth: '10px'}}>{`DESPACHO Nº: ${this.props.payment_id}`}</div>
              </div>
            </thead>
            <tbody>
              <div style={{ width: '100%', heigth: '20px'}}>
                <span style={{visibility: 'hidden'}}>teste</span>
              </div>
              <tr>
                <span style={{fontWeight: 'bold'}}>Dados do pagador</span><br></br>
              </tr>
              <tr/>
              <tr/>
              <tr>
                <span>{`Municipio: Prefeitura Municipal de ${this.props.city} - ${this.props.UF}`}</span><br></br>
              </tr>
              <tr>
                <span>{`CNPJ: ${this.props.prefecture_cnpj}`}</span><br></br>
              </tr>
              <tr/>
              <tr/>
              <tr/>
              <tr/>
              <tr/>
              <tr/>
              <tr>
                <span>{`Ordenador de despesa: ${this.props.computer_name}`}</span><br></br>
              </tr>
              <tr/>
              <tr/>
              <tr/>
              <tr/>
              <tr/>
              <tr/>
              <div style={{ width: '100%', heigth: '20px'}}>
                <span style={{visibility: 'hidden'}}>teste</span>
              </div>
              <tr>
                <span style={{fontWeight: 'bold'}}>Dados do fornecedor</span><br></br> 
              </tr>
              <tr/>
              <tr/>
              <tr>
                <span>Nome/Razão Social: </span>
                <span style={{fontWeight: 'semibold'}}>{`${this.props.company}`}</span>
              </tr>
              <tr>
                <span>CNPJ: </span>
                <span style={{fontWeight: 'semibold'}}>{`${cnpjOrCpfFormated}`} </span>
              </tr>
              <tr/>
              <tr/>
              <tr/>
              <tr/>
              <tr/>
              <tr/>
              <tr>
                <span>Competência:</span><br></br>
                <div style={{width: '180px', heigth: '10px', border: '2px solid #000', borderRadius: '6px', padding: '6px'}}>
                  <span>{`${this.props.month_payment.month} de 2023`}</span>
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
              <div style={{ width: '100%', heigth: '20px'}}>
                <span style={{visibility: 'hidden'}}>teste</span>
              </div>
              <tr>
                <span style={{fontWeight: 'bold'}}>{`DESPACHO Nº ${this.props.payment_id}`}</span><br></br>
              </tr>
              <tr/>
              <tr/>
              <tr>
                <span style={{fontWeight: 'semibold'}}>{`De acordo, encaminhe-se este processo de pagamento à fazenda pública municipal, para que seja averiguado se é um caso de realização de retenção tributária, para que seja providenciado a emissão de Termo de Notificação de Lançamento, bem como a emissão do respectivo Documento de Arrecadação Municipal – DAM ou quando não for o caso, para que seja emitida certidão de não exigibilidade.`}</span><br></br>
              </tr>
              <div style={{ width: '100%', heigth: '20px'}}>
                <span style={{visibility: 'hidden'}}>teste</span>
              </div>
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
                <div style={{ display: 'flex', width: '100%', heigth: '10px', justifyContent: 'center'}}>
                  <span style={{fontWeight: 'regular'}}>{`${this.props.city} - ${this.props.UF}, ${this.props.month_payment?.day} de ${this.props.month_payment.month} de 2023 `} </span>
                </div>
              </tr>
              <div style={{ width: '100%', heigth: '20px'}}>
                <span style={{visibility: 'hidden'}}>teste</span>
              </div>
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
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', heigth: '10px', justifyContent: 'center', alignItems: 'center'}}>
                  <div style={{ width: '60%', heigth: '1px', background: '#000', border: '0.5px solid #000'}}></div><br></br>
                  <span>{this.props.user_name}</span>
                  <span>{this.props.registration}</span>
                </div>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

export const FunctionalDespachoTemplate = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len
  return <DespachoTemplate ref={ref} text={props.text} />;
});
