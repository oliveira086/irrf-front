import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import * as chakra from '@chakra-ui/react';
import { AiOutlineSearch, AiOutlineCloseCircle, AiOutlineCheckCircle, AiFillDelete } from 'react-icons/ai'
import moment from 'moment/moment';
import { Player } from '@lottiefiles/react-lottie-player';
import Zoom from 'react-medium-image-zoom'

import 'moment/locale/pt-br';
import 'react-medium-image-zoom/dist/styles.css'

import Header from '../../components/molecules/Header';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import MoneyInput from '../../components/atoms/MoneyInput';
import Select from '../../components/atoms/Select';
import Modal from '../../components/atoms/Modal';

import { getUserInformations } from '../../services/authServices';
import { getAllPrePayments, updatePrePaymentById, confirmPrePayment, calculePrePayment } from '../../services/prePaymentServices';
import { getComputersByCity } from "../../services/paymentServices";
import { verifyCompany } from "../../services/companyServices";

import convertCurrency from '../../utils/convertCurrency';
// import { socket } from '../../utils/socket';

import { PrePaymentStyle } from './style';

const PrePaymentItem = ({ img, city, state, date, tax_note, data, modalData, setData, onClick, computers, setComputer, computerSelected,
  setComputerSelected, companyData, setCompanyData }) => {
  
    console.log(date);
  async function openModal() {
    setData(data);
    onClick();
    
    const verifyCompanyData = await verifyCompany({ body:{ city_id: data.city_id }, cnpj: data.cnpj });
    let replacementData = [];

    verifyCompanyData.body.map(companyCallback => {
      replacementData.push({ label: companyCallback.object, value: companyCallback })
    });

    setCompanyData(replacementData);

    let responseComputers = await getComputersByCity({ city_id: data.city_id});
    setComputer(responseComputers.body);
    setComputerSelected([]);
  }

  computers.map(computerDataCallback => {
    if(computerDataCallback.id == modalData?.computer_id) {
      return setComputerSelected(computerSelected.length == 0 ? computerDataCallback : computerSelected);
    }
  });

  return (
    <div className={PrePaymentStyle.ItemContainer} onClick={() => { openModal()} }>
      {img.indexOf('.pdf') == -1 ? 
        <div className={`w-28 h-28 mr-10`}>
          <img src={img} className='w-28 h-28' />
        </div>
      :
        <embed src={img} className={`w-28 h-28 mr-10`} type="application/pdf"></embed>
      }
        <div className={PrePaymentStyle.InfoItemContainer}>

          <div className='w-96 flex flex-col justify-around'>
            <div className='flex flex-col'>
              <span className='font-semibold text-[#142566]'>Cidade</span>
              <span>{city}</span>
            </div>

            <div className='flex flex-col'>
              <span className='font-semibold text-[#142566]'>Data</span>
              <span>{date}</span>
            </div>
          </div>

          <div className='w-96 flex flex-col justify-around mt-2'>
            <div className='flex flex-col'>
              <span className='font-semibold text-[#142566]'>Estado</span>
              <span>{state}</span>
            </div>

            <div className='flex flex-col'>
              <span className='font-semibold text-[#142566]'>Nota Fiscal</span>
              <span>{tax_note}</span>
            </div>
          </div>
        </div>
    </div>
  )
}

const PrePaymentModal = ({ isOpen, setIsOpen, imagem, modalData, computerSelected, computerData, companyData, setCompanyData, setComputerSelected, companySelected, setCompanySelected }) => {
  const toast = chakra.useToast();
  const navigate = useNavigate();

  // Estado para Formulario no Modal ===
  const [cnpj, setCnpj] = useState();
  const [value, setValue] = useState(`${modalData?.value}`);
  const [calculateBasis, setCalculateBasis] = useState(`${modalData?.calculation_basis}`);
  const [aliquot, setAliquot] = useState(`${modalData?.index}`);
  const [taxNote, setTaxNote] = useState(`${modalData?.tax_note}`);
  const [taxNoteSerie, setTaxNoteSerie] = useState(`${modalData?.tax_note_serie}`);
  const [isTaxable, setIsTaxable] = useState(true);
  // ===================================
  // Estado para Formulario de pagamento associado no Modal ===
  const [valueAssociate, setValueAssociate] = useState(`${modalData?.['pre_payment_associate_id.value']}`);
  const [calculateBasisAssociate, setCalculateBasisAssociate] = useState(`${modalData?.['pre_payment_associate_id.calculation_basis']}`);
  const [aliquotAssociate, setAliquotAssociate] = useState(`${modalData?.['pre_payment_associate_id.index']}`);
  const [issItemCod, setIssItemCod] = useState('');
  const [irrfItemCod, setIrrfItemCode] = useState('');
  // ===================================
  // Informações sobre o fornecedor
  const [isService, setIsService] = useState();
  const [isProduct, setIsProduct] = useState();
  const [isSimple, setIsSimple] = useState();
  const [nonIncidence, setNonIncidence] = useState();
  const [isSimei, setIsSimei] = useState();
  const [comment, setComment] = useState('');
  // ===================================
  
  useEffect(() => {
    validateTaxablePayment(modalData);
    setCnpj(modalData?.cnpj);
    setTaxNote(modalData?.tax_note);
    setValue(modalData?.value);
    setTaxNoteSerie(modalData?.tax_note_serie);
    setCalculateBasis(modalData?.calculation_basis);
  
    // Inserindo valores do pre pagamento associado
    setValueAssociate(`${modalData?.['pre_payment_associate_id.value']}`);
    setAliquotAssociate(`${modalData?.['pre_payment_associate_id.index']}`);
    setCalculateBasisAssociate(`${modalData?.['pre_payment_associate_id.calculation_basis']}`)
    // ===========================================
  
    setIsService(modalData?.['company_id_pre_payments.is_service']);
    setIsProduct(modalData?.['company_id_pre_payments.is_product']);
    setIsSimple(modalData?.['company_id_pre_payments.is_simple']);
    setNonIncidence(modalData?.['company_id_pre_payments.non_incidence']);
    setIsSimei(modalData?.['company_id_pre_payments.is_simei']);

    setIssItemCod(`${modalData?.['company_id_pre_payments.iss_companies_id.iss_companies_iss_services_id.iss_services_products_services_id.label']}`.split('–')[0]);
    setIrrfItemCode(modalData?.['company_id_pre_payments.products_services_id_company.code']);

    // Logica para inserir a aliquota correta
    if(modalData?.['company_id_pre_payments.is_simple'] == true && modalData?.index == null) {
      setAliquot('');
    } else if(modalData?.index !== null) {
      setAliquot(modalData?.index);
    } else if(modalData?.['company_id_pre_payments.is_simple'] == false && modalData?.['company_id_pre_payments.is_service'] == true) {
      setAliquot(modalData?.['company_id_pre_payments.iss_companies_id.iss_companies_iss_services_id.value']);
    } else if(modalData?.['company_id_pre_payments.is_product'] == true && modalData?.['company_id_pre_payments.is_service'] == false) {
      setAliquot(modalData?.['company_id_pre_payments.aliquot']);
    } 
    if(Number(modalData?.is_taxable) == 4) {
      setAliquot(0);
    }
  }, [modalData]);

  function openAndCloseModal () {
    setIsOpen(!isOpen);
    setCompanyData([]);
  }

  function selectedCompanyWithObject(params) {
    setIsService(params?.value?.is_service);
    setIsProduct(params?.value?.is_product);
    setIsSimple(params?.value?.is_simple);
    setCompanySelected(params);

  }

  const HandleCalculatePrePayment = async () => {

    try {
      if (aliquot == null || aliquot == undefined) {
        toast({
          title: 'Aliquota não pode está vazia',
          status: 'error',
          position: 'top-right',
          isClosable: true,
        });
      } else {
        if (computerSelected.length <= 0) {
          toast({
            title: 'Selecione o Ordenador de despesas',
            status: 'error',
            position: 'top-right',
            isClosable: true,
          });
        } else {
          const paymentsToUpdate = [];

          if(calculateBasis == null || calculateBasis == '' || calculateBasis == 'null' || calculateBasis == undefined) {
            setCalculateBasis(value);
          }

          if( calculateBasisAssociate == null || calculateBasisAssociate == 'null' || calculateBasisAssociate == undefined) {
            setCalculateBasisAssociate(valueAssociate);
          }

          const object = {
            company_id: companySelected?.value == undefined ? modalData?.['company_id_pre_payments.id'] : companySelected?.value?.id,
            pre_payment_id: modalData.id,
            tax_note: taxNote,
            calculation_basis: parseFloat(convertCurrency(calculateBasis == null ? value : calculateBasis)),
            computer_id: computerSelected.id,
            index: parseFloat(aliquot),
            tax_note_serie: taxNoteSerie,
            value: parseFloat(convertCurrency(value))
          };
          

          paymentsToUpdate.push(object);

          if (modalData.pre_payment_associate == null) {
            // fluxo de inserção acaba aqui
          } else {

            const objectToAssociate = {
              company_id: companySelected?.value == undefined ? modalData?.['company_id_pre_payments.id'] : companySelected?.value?.id,
              pre_payment_id: modalData.pre_payment_associate,
              tax_note: taxNote,
              calculation_basis: parseFloat(convertCurrency(calculateBasisAssociate == 'null' ? valueAssociate : calculateBasisAssociate )),
              computer_id: computerSelected.id,
              index: parseFloat(aliquotAssociate),
              tax_note_serie: taxNoteSerie,
              value: parseFloat(convertCurrency(valueAssociate))
            };

            paymentsToUpdate.push(objectToAssociate);

          };

          await Promise.all(paymentsToUpdate.map(async paymentsToUpdateCallback => {
            await updatePrePaymentById(paymentsToUpdateCallback);
          }));

          if (paymentsToUpdate[0] == null || paymentsToUpdate[0] == []) {
            
          } else {
            await confirmPrePayment({ pre_payment_id: paymentsToUpdate[0]?.pre_payment_id}).then(response => {
              toast({
                title: 'Pré pagamento calculado com sucesso!',
                status: 'success',
                position: 'top-right',
                isClosable: true,
              });
  
              navigate(0);
              openAndCloseModal();
  
            }).catch(error => {
              toast({
                title: 'Houve um problema ao calcular esse pré pagamento!',
                status: 'error',
                position: 'top-right',
                isClosable: true,
              });
            });
          };
        };
      };
      
    } catch (error) {
      console.log(error);
      toast({
        title: 'Houve um problema ao calcular esse pré pagamento!',
        status: 'error',
        position: 'top-right',
        isClosable: true,
      });
    };
  };

  const HandleSavePrePayment = async () => {
    if(aliquot == null || aliquot == undefined) {
      toast({
        title: 'Aliquota não pode está vazia',
        status: 'error',
        position: 'top-right',
        isClosable: true,
      });
    } else {
      const paymenstToUpdate = [];

      const object = {
        company_id: companySelected?.value == undefined ? modalData?.['company_id_pre_payments.id'] : companySelected?.value?.id,
        pre_payment_id: modalData.id,
        tax_note: taxNote,
        calculation_basis: parseFloat(convertCurrency(calculateBasis)),
        computer_id: computerSelected.id,
        index: parseFloat(aliquot),
        tax_note_serie: taxNoteSerie,
        value: parseFloat(convertCurrency(value))
      }

      paymenstToUpdate.push(object);

      if(modalData.pre_payment_associate == null) {
        // fluxo de inserção acaba aqui
      } else {
        const objectToAssociate = {
          company_id: companySelected?.value == undefined ? modalData?.['company_id_pre_payments.id'] : companySelected?.value?.id,
          pre_payment_id: modalData.pre_payment_associate,
          tax_note: taxNote,
          calculation_basis: parseFloat(convertCurrency(calculateBasisAssociate)),
          computer_id: computerSelected.id,
          index: parseFloat(aliquotAssociate),
          tax_note_serie: taxNoteSerie,
          value: parseFloat(convertCurrency(valueAssociate))
        }

        paymenstToUpdate.push(objectToAssociate);
      }

      paymenstToUpdate.map(async paymentsToUpdateCallback => {
          await updatePrePaymentById(paymentsToUpdateCallback).then(response => {
          toast({
            title: 'Pré pagamento Atualizado!',
            status: 'success',
            position: 'top-right',
            isClosable: true,
          });
                
          openAndCloseModal();
        }).catch(error => {
          toast({
            title: 'Houve um problema ao atualizar esse pré pagamento!',
            status: 'error',
            position: 'top-right',
            isClosable: true,
          });
        });
      });

      return paymenstToUpdate;
    }
  }

  function validateTaxablePayment (prePaymentData) {

    if(prePaymentData.index == 0 || prePaymentData.index == null) {
      setIsTaxable(prePaymentData.is_taxable == 4 ? false : true );
    }
  }

  return (
    <Modal isCentered size={'xl'} title={'Auditar Pré Pagamento'} isOpen={isOpen} modalOpenAndClose={openAndCloseModal}>
      <div className={PrePaymentStyle.ModalBodyContainer}>
        <div className={PrePaymentStyle.ImageModalContainer}>
          {imagem?.indexOf('.pdf') == -1 ?
            <div className={`w-full h-[36vh]`}>
              <Zoom>
                <img src={modalData?.tax_note_link} className='w-full h-[56vh] pb-2' />
              </Zoom>
            </div>
            :
            <div className={`w-full h-[36vh]`}>
              <embed src={modalData?.tax_note_link} className={`w-full h-[56vh] pb-2`}></embed>
            </div>
          }
        </div>

        <div className={PrePaymentStyle.ContentModalContainer}>
          <form className='border border-dashed rounded p-2 h-auto '>
            <div className={PrePaymentStyle.RowContainer}>
              <div className='w-96'>
                <Select placeholder={'Ordenador de despesa'}
                  selectedValue={computerSelected}
                  setSelectedValue={(item) => setComputerSelected(item)}
                  options={computerData}
                />
              </div>
              <div className='w-60 ml-4'>
                <Input label='CNPJ Ordenador' placeholder='CNPJ Ordenador' value={computerSelected?.cnpj} />
              </div>
            </div>
            
            <div className={PrePaymentStyle.RowContainer}>
              <div className='w-60 mr-4'>
                <Input label='CNPJ Fornecedor' placeholder='CNPJ' value={cnpj} onChange={e => setCnpj(e.target.value)} />
              </div>

              <div className='w-40'>
                <Input label='Nota fiscal' placeholder='Nota fiscal' value={taxNote} onChange={e => setTaxNote(e.target.value)}  />
              </div>

              <div className='w-52 ml-4'>
                <Input label='Serie' placeholder='Serie' value={taxNoteSerie} onChange={e => setTaxNoteSerie(e.target.value)}/>
              </div>
            </div>

            { companyData.length > 1 ?
              <div className={PrePaymentStyle.RowContainer}>
                <div className='w-full'>
                  <Select placeholder={'Objeto'}
                    selectedValue={companySelected}
                    setSelectedValue={(item) => selectedCompanyWithObject(item)}
                    options={companyData} />
                </div>
              </div>
              : 
              <>
              </>
            }
                
            <div className={PrePaymentStyle.RowContainer}>
              <div>
                <span className={`my-2 font-semibold ${ modalData?.['city_id_pre_payments.opt_law'] == true && modalData?.['city_id_pre_payments.opt_legal'] == false ? 'text-[#18BA18]' : 'text-[#2F4ECC]'}` }>
                  
                  {
                    isTaxable ? 
                    <>
                      {modalData?.type == 'simples' ? `${modalData?.['city_id_pre_payments.opt_law'] == true && modalData?.['city_id_pre_payments.opt_legal'] == false  ? 'ISS - Jurisprudencia' : 'ISS - Legal'}` : 'IRRF'}
                    </>
                    :
                    <>{'Digite o valor da nota e a base de calculo'}</>
                  }

                  
                </span>
                <div className='flex p-2 w-auto border rounded-lg'>
                  <div className='w-44 mr-3'>
                    <MoneyInput label='Crédito / Pagamento' placeholder='Crédito de pagamento' value={value} onChange={e => setValue(e.target.value)} />
                  </div>

                  <div className='w-44 mr-3'>
                    <MoneyInput label='Base de Cálculo' placeholder='Base de cálculo' value={modalData?.type == 'simples' ? calculateBasis : value } onChange={e => setCalculateBasis(e.target.value)} />
                  </div>

                  {
                    isTaxable ?
                    <>
                      <div className='w-24 mr-3'>
                        <Input label={modalData?.type == 'simples' ? 'Item' : 'Código'} placeholder='' value={modalData?.type == 'simples' ? issItemCod : irrfItemCod}/>
                      </div>

                      <div className='w-36'>
                        <Input label='Aliquota' placeholder='Aliquota' value={aliquot} onChange={e => modalData?.['company_id_pre_payments.is_simple'] == true && modalData?.type == 'simples' ? setAliquot(e.target.value) : ''}/>
                      </div>
                    </>
                    :
                    <></>
                  }
                  
                </div>
              </div>
            </div>

            { modalData?.pre_payment_associate == null ?
              <></>
              :
              <>
                <div className={PrePaymentStyle.RowContainer}>
                  <div>
                    <span className={`my-2 font-semibold ${ modalData?.['city_id_pre_payments.opt_law'] == true && modalData?.['city_id_pre_payments.opt_legal'] == false ? 'text-[#18BA18]' : 'text-[#2F4ECC]'}`}>
                      {modalData?.['pre_payment_associate_id.type'] == 'simples' ? `${modalData?.['city_id_pre_payments.opt_law'] == true && modalData?.['city_id_pre_payments.opt_legal'] == false  ? 'ISS - Jurisprudencia' : 'ISS - Legal'}` : 'IRRF'}
                    </span>
                    <div className='flex p-2 w-auto border rounded-lg'>
                      <div className='w-44 mr-3'>
                        <MoneyInput label='Crédito / Pagamento' placeholder='Crédito de pagamento' value={valueAssociate} onChange={e => setValueAssociate(e.target.value)} />
                      </div>

                      <div className='w-44 mr-3'>
                        <MoneyInput label='Base de Cálculo' placeholder='Base de cálculo' value={modalData?.['pre_payment_associate_id.type'] == 'simples' ? calculateBasisAssociate : valueAssociate} onChange={e => setCalculateBasisAssociate(e.target.value)} />
                      </div>

                      <div className='w-24 mr-3'>
                        <Input label={modalData?.['pre_payment_associate_id.type'] == 'simples' ? 'Item' : 'Código'} placeholder='' value={modalData?.['pre_payment_associate_id.type'] == 'simples' ? issItemCod : irrfItemCod}/>
                      </div>

                      <div className='w-36'>
                        <Input label='Aliquota' placeholder='Aliquota' value={aliquotAssociate} onChange={e => modalData?.['company_id_pre_payments.is_simple'] == true && modalData?.['pre_payment_associate_id.type'] == 'simples' ? setAliquotAssociate(e.target.value) : ''}/>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            }
                
            <div className='flex flex-col w-full h-auto mt-2 border border-dashed rounded p-2'>
              <span className='text-2xl font-semibold'>Informações do Fornecedor</span>
              <div className='w-full h-auto'>
                <span className='font-semibold'>Objeto do contrato: </span>
                <span>{modalData?.['company_id_pre_payments.object']}</span>
              </div>
              
              <div className='flex flex-wrap w-full mt-2 justify-between'>
                <div className='flex w-36 h-10 bg-[#ededed] rounded items-center justify-center mt-2'>
                  {isSimple == true ? <AiOutlineCheckCircle size={20} color={'#18BA18'}/> : <AiOutlineCloseCircle size={20} color={'#BB0000'}/>}
                  <span className='font-semibold ml-2'>Simples</span>
                </div>
                <div className='flex w-56 h-10 bg-[#ededed] rounded items-center justify-center mt-2'>
                  {isService == true ? <AiOutlineCheckCircle size={20} color={'#18BA18'}/> : <AiOutlineCloseCircle size={20} color={'#BB0000'}/>}
                  <span className='font-semibold ml-2'>Fornece Serviços</span>
                </div>
                <div className='flex w-56 h-10 bg-[#ededed] rounded items-center justify-center mt-2'>
                  {isProduct == true ? <AiOutlineCheckCircle size={20} color={'#18BA18'}/> : <AiOutlineCloseCircle size={20} color={'#BB0000'}/>}
                  <span className='font-semibold ml-2'>Fornece Produtos</span>
                </div>
                <div className='flex w-56 h-10 bg-[#ededed] rounded items-center justify-center mt-2'>
                  {nonIncidence == true ? <AiOutlineCheckCircle size={20} color={'#18BA18'}/> : <AiOutlineCloseCircle size={20} color={'#BB0000'}/>}
                  <span className='font-semibold ml-2'>Não Incidente</span>
                </div>
                <div className='flex w-56 h-10 bg-[#ededed] rounded items-center justify-center mt-2'>
                  {isSimei == true ? <AiOutlineCheckCircle size={20} color={'#18BA18'}/> : <AiOutlineCloseCircle size={20} color={'#BB0000'}/>}
                  <span className='font-semibold ml-2'>Simei</span>
                </div>
              </div>
            </div>

            <div className='w-full h-auto mt-4'>
              <span className='font-semibold'>Motivo para indeferimento</span>
              <chakra.Textarea className="h-full mt-2" placeholder='Adicione um comentário que ajude a resolver o problema' value={comment} onChange={e => setComment(e.target.value)} />
            </div>
          </form>

          <div className='flex mt-8 h-auto'>
            <div className='w-56 mr-10'>
              <Button label='Salvar' type='second' onPress={HandleSavePrePayment}/>
            </div>
            <div className='w-56'>
              <Button label='Calcular' onPress={HandleCalculatePrePayment} />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

const PrePayment = () => {
  const [userName, setUserName] = useState('');
  const [cityName, setCityName] = useState('');
  const [prePaymentData, setPrePaymentData] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [computerData, setComputerData] = useState([]);
  const [computerSelected, setComputerSelected] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [companySelected, setCompanySelected] = useState();

  const [isOpen, setIsOpen] = useState();
  const imagem = modalData?.tax_note_link;
  moment.locale('pt-br');
  const toast = chakra.useToast();
  const navigate = useNavigate();

  // Estado para Formulario no Modal ===
  const [cnpj, setCnpj] = useState();
  const [value, setValue] = useState(`${modalData?.value}`);
  const [calculateBasis, setCalculateBasis] = useState(`${modalData?.calculation_basis}`);
  const [aliquot, setAliquot] = useState(`${modalData?.index}`);
  const [taxNote, setTaxNote] = useState(`${modalData?.tax_note}`);
  const [taxNoteSerie, setTaxNoteSerie] = useState(`${modalData?.tax_note_serie}`);
  // ===================================
  // Estado para Formulario de pagamento associado no Modal ===
  const [valueAssociate, setValueAssociate] = useState('');
  const [calculateBasisAssociate, setCalculateBasisAssociate] = useState('');
  const [aliquotAssociate, setAliquotAssociate] = useState('');
  const [issItemCod, setIssItemCod] = useState('');
  const [irrfItemCod, setIrrfItemCode] = useState('');
  // ===================================
  // Informações sobre o fornecedor
  const [isService, setIsService] = useState();
  const [isProduct, setIsProduct] = useState();
  const [isSimple, setIsSimple] = useState();
  // ===================================

  // useEffect(() => {
  //   socket.on('/pre-payments/create', (socketResponse) => {
  //     if(socketResponse == 'Refresh') {
  //       getAllPrePayments().then(response => {
  //         setPrePaymentData(response.rows);
  //       });
  //     }
  //   });
  //   return function cleanup() {socket.off('/pre-payments/create')}
  // }, [])
  
  useEffect(() => {

    let arrayWithPrePayments = [];

    function verificarPrePaymentAssociate(id) {
      let index = arrayWithPrePayments.findIndex(indexCallback => indexCallback.id == id);
      let indexPrePaymentAssociate = arrayWithPrePayments.findIndex(indexCallback => indexCallback.pre_payment_associate == id);

      if (index < 0 && indexPrePaymentAssociate < 0) {
        return false;
      } else {
        return true;
      };
    };

    (async () => {
      await getUserInformations({ currentPage: 1 }).then(response => {
        setUserName(response.body.user_name);
        setCityName(response.body.city_name);
      });

      await getAllPrePayments().then(response => {
        response.rows.map((prePaymentsCallback) => {
          if (prePaymentsCallback.pre_payment_associate == null) {
            arrayWithPrePayments.push(prePaymentsCallback);
          } else {
            if (verificarPrePaymentAssociate(prePaymentsCallback.id) == false) {
              arrayWithPrePayments.push(prePaymentsCallback);
            };
          };
        });

        setPrePaymentData(arrayWithPrePayments);

      });
    })();
  }, []);

  useEffect(() => {
    setCnpj(modalData?.cnpj);
    setTaxNote(modalData?.tax_note);
    setValue(modalData?.value);
    setTaxNoteSerie(modalData?.tax_note_serie);
    setCalculateBasis(modalData?.calculation_basis);

    // Inserindo valores do pre pagamento associado
    setValueAssociate(`${modalData?.['pre_payment_associate_id.value']}`);
    setAliquotAssociate(`${modalData?.['pre_payment_associate_id.index']}`);
    setCalculateBasisAssociate(`${modalData?.['pre_payment_associate_id.calculation_basis']}`)
    // ===========================================

    setIsService(modalData?.['company_id_pre_payments.is_service']);
    setIsProduct(modalData?.['company_id_pre_payments.is_product']);
    setIsSimple(modalData?.['company_id_pre_payments.is_simple']);
    setIssItemCod(`${modalData?.['company_id_pre_payments.iss_companies_id.iss_companies_iss_services_id.iss_services_products_services_id.label']}`.split('–')[0]);
    setIrrfItemCode(modalData?.['company_id_pre_payments.products_services_id_company.code']);

    // Logica para inserir a aliquota correta
    if(modalData?.['company_id_pre_payments.is_simple'] == true && modalData?.index == null) {
      setAliquot('');
    } else if(modalData?.index !== null) {
      setAliquot(modalData?.index);
    } else if(modalData?.['company_id_pre_payments.is_simple'] == false && modalData?.['company_id_pre_payments.is_service'] == true) {
      setAliquot(modalData?.['company_id_pre_payments.iss_companies_id.iss_companies_iss_services_id.value']);
    } else if(modalData?.['company_id_pre_payments.is_product'] == true && modalData?.['company_id_pre_payments.is_service'] == false) {
      setAliquot(modalData?.['company_id_pre_payments.aliquot']);
    }

    if(Number(modalData?.is_taxable) == 4) {
      setAliquot(0);
    }
    // =====================================
  }, [modalData]);

  function openAndCloseModal () {
    setIsOpen(!isOpen);
    setCompanyData([]);
  }

  return (
    <section className={PrePaymentStyle.Container}>
      <Header userName={userName} cityName={cityName} />
      <div className={PrePaymentStyle.BodyContainer}>
        <div className={PrePaymentStyle.TitleContainer}>
          <h1 className='text-3xl font-semibold'>Pré pagamentos</h1>
          <div className='w-auto flex items-end mt-2'>
            <div className='w-72 mr-4'>
              <Input label='Pesquisar' placeholder='Pesquisar por CNPJ'/>
            </div>
            <div className={PrePaymentStyle.TitleButtonContainer}>
              <Button label={<AiOutlineSearch />}/>
            </div>
          </div>
        </div>
        <PrePaymentModal isOpen={isOpen} setIsOpen={setIsOpen} imagem={imagem} modalData={modalData} computerSelected={computerSelected}
          computerData={computerData} cnpj={cnpj} taxNote={taxNote} taxNoteSerie={taxNoteSerie} companyData={companyData} value={value}
          calculateBasis={calculateBasis} irrfItemCod={irrfItemCod} issItemCod={issItemCod} aliquot={aliquot} isSimple={isSimple} isService={isService}
          isProduct={isProduct} setCompanyData={setCompanyData} valueAssociate={valueAssociate} calculateBasisAssociate={calculateBasisAssociate}
          aliquotAssociate={aliquotAssociate} setValue={setValue} setComputerSelected={setComputerSelected} companySelected={companySelected} setCompanySelected={setCompanySelected}
        />
        {
          prePaymentData.length > 0 ?
            <div className={PrePaymentStyle.ItemsBody}>
              {prePaymentData.map(prePaymentDataCallback => {
                return (
                  <PrePaymentItem
                    img={prePaymentDataCallback.tax_note_link}
                    city={prePaymentDataCallback['city_id_pre_payments.label']}
                    state={prePaymentDataCallback['city_id_pre_payments.city_uf_id.label']}
                    date={moment(prePaymentDataCallback.createdAt).format('DD/MM/YYYY : HH:mm:ss')}
                    tax_note={prePaymentDataCallback.tax_note}
                    data={prePaymentDataCallback}
                    modalData={modalData}
                    setData={setModalData}
                    computers={computerData}
                    computerSelected={computerSelected}
                    setComputer={setComputerData}
                    setComputerSelected={setComputerSelected}
                    onClick={openAndCloseModal}
                    companyData={companyData}
                    setCompanyData={setCompanyData}
                  />
                )
              })}
            </div>
            :
            <div className='flex flex-col w-5/12 h-full items-center justify-center'>
              <Player
                src='https://assets8.lottiefiles.com/private_files/lf30_fn9xcfqg.json'
                className="player"
                loop
                autoplay
              />
              <span className='text-[#999] font-semibold'>Não foram encontrados registros</span>
            </div>
        }
      </div>
    </section>
  )
}

export default PrePayment;