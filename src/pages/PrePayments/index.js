import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import * as chakra from '@chakra-ui/react';
import { AiOutlineSearch, AiOutlineCloseCircle, AiOutlineCheckCircle } from 'react-icons/ai'
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
import { getAllPrePayments, updatePrePaymentById, confirmPrePayment } from '../../services/prePaymentServices';
import { getComputersByCity } from "../../services/paymentServices";

import convertCurrency from '../../utils/convertCurrency';

import { PrePaymentStyle } from './style';

const PrePaymentItem = ({ img, city, state, date, tax_note, data, modalData, setData, onClick, computers, setComputer, computerSelected, setComputerSelected }) => {
  
  async function openModal() {
    setData(data);
    onClick();

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
        <embed src={img} className={`w-28 h-28 mr-10`}></embed>
      }
        <div className={PrePaymentStyle.InfoItemContainer}>
          <div className='flex justify-around'>
            <div className='w-1/3 flex flex-col'>
              <span className='font-semibold text-[#142566]'>Cidade</span>
              <span>{city}</span>
            </div>

            <div className='w-1/3 flex flex-col'>
              <span className='font-semibold text-[#142566]'>Data</span>
              <span>{date}</span>
            </div>
          </div>

          <div className='flex justify-around mt-2'>
            <div className='w-1/3 flex flex-col'>
              <span className='font-semibold text-[#142566]'>Estado</span>
              <span>{state}</span>
            </div>

            <div className='w-1/3 flex flex-col'>
              <span className='font-semibold text-[#142566]'>Nota Fiscal</span>
              <span>{tax_note}</span>
            </div>
          </div>
        </div>
    </div>
  )
}

const PrePayment = () => {
  const [userName, setUserName] = useState('');
  const [cityName, setCityName] = useState('');
  const [prePaymentData, setPrePaymentData] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [computerData, setComputerData] = useState([]);
  const [computerSelected, setComputerSelected] = useState([]);

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

  
  useEffect(() => {
    (async () => {
      await getUserInformations().then(response => {
        setUserName(response.body.user_name);
        setCityName(response.body.city_name);
      });

      await getAllPrePayments().then(response => {
        setPrePaymentData(response.rows);
      });
    })();
  }, []);

  useEffect(() => {
    setCnpj(modalData?.cnpj);
    setTaxNote(modalData?.tax_note);
    setValue(modalData?.value);
    setTaxNoteSerie(modalData?.tax_note_serie);
    setCalculateBasis(modalData?.calculation_basis);

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
    // =====================================
  }, [modalData]);

  function openAndCloseModal () {
    setIsOpen(!isOpen);
  }

  const HandleSavePrePayment = async () => {

    const object = {
      pre_payment_id: modalData.id,
      tax_note: taxNote,
      calculation_basis: parseFloat(convertCurrency(calculateBasis)),
      computer_id: computerSelected.id,
      index: parseFloat(aliquot),
      tax_note_serie: taxNoteSerie,
      value: parseFloat(convertCurrency(value)),
    }

    await updatePrePaymentById(object).then(response => {
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
  }

  const HandleCalculatePrePayment = async () => {

    try {
      await HandleSavePrePayment();

      confirmPrePayment({ pre_payment_id: modalData.id }).then(response => {
        toast({
          title: 'Pré pagamento Calculado com sucesso!',
          status: 'success',
          position: 'top-right',
          isClosable: true,
        });

        navigate(0);
      }).catch(error => {
        toast({
          title: 'Houve um problema ao calcular esse pré pagamento!',
          status: 'error',
          position: 'top-right',
          isClosable: true,
        });
      });
      
    } catch(error) {
      toast({
        title: 'Houve um problema ao calcular esse pré pagamento!',
        status: 'error',
        position: 'top-right',
        isClosable: true,
      });
    }
    
  }

  return (
    <section className={PrePaymentStyle.Container}>
      <Header userName={userName} cityName={cityName} />
      <div className={PrePaymentStyle.BodyContainer}>
        <div className={PrePaymentStyle.TitleContainer}>
          <h1 className='text-3xl font-semibold'>Pre pagamentos</h1>
          <div className='w-auto flex items-end mt-2'>
            <div className='w-72 mr-4'>
              <Input label='Pesquisar' placeholder='Pesquisar por CNPJ'/>
            </div>
            <div className={PrePaymentStyle.TitleButtonContainer}>
              <Button label={<AiOutlineSearch />}/>
            </div>
          </div>
        </div>

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
              <form className='h-auto'>
                <div className={PrePaymentStyle.RowContainer}>
                  <div className='w-full pr-16'>
                    <Select placeholder={'Ordenador de despesa'}
                      selectedValue={computerSelected}
                      setSelectedValue={(item) => setComputerSelected(item)}
                      options={computerData}
                    />
                  </div>
                </div>

                <div className={PrePaymentStyle.RowContainer}>
                  <div className='w-60 mr-4'>
                    <Input label='CNPJ' placeholder='CNPJ' value={cnpj} onChange={e => setCnpj(e.target.value)} />
                  </div>

                  <div className='w-56'>
                    <Input label='Nota fiscal' placeholder='Nota fiscal' value={taxNote} onChange={e => setTaxNote(e.target.value)}  />
                  </div>
                </div>

                <div className={PrePaymentStyle.RowContainer}>
                  <div className='w-60'>
                    <MoneyInput label='Crédito / Pagamento' placeholder='Crédito de pagamento' value={value} onChange={e => setValue(e.target.value)} />
                  </div>
                  <div className='w-56 ml-4'>
                    <Input label='Serie' placeholder='Serie' value={taxNoteSerie} onChange={e => setTaxNoteSerie(e.target.value)}/>
                  </div>
                </div>

                <div className={PrePaymentStyle.RowContainer}>
                  <div className='w-60 mr-4'>
                    <MoneyInput label='Base de Cálculo' placeholder='Base de cálculo' value={calculateBasis} onChange={e => setCalculateBasis(e.target.value)} />
                  </div>
                  <div className='w-56'>
                    <Input label='Aliquota' placeholder='Aliquota' value={aliquot} onChange={e => setAliquot(e.target.value)}/>
                  </div>
                </div>

                <div className='flex flex-col w-full h-auto mt-2'>
                  <span className='text-2xl font-semibold'>Informações do Fornecedor</span>
                  <div className='w-full h-auto'>
                    <span className='font-semibold'>Objeto do contrato: </span>
                    <span>{modalData?.['company_id_pre_payments.object']}</span>
                  </div>
                  <div className='flex w-full mt-2'>
                    <div className='flex p-2 bg-[#ededed] rounded items-center justify-center mr-2'>
                      {modalData?.['company_id_pre_payments.is_simple'] == true ? <AiOutlineCheckCircle size={20} color={'#18BA18'}/> : <AiOutlineCloseCircle size={20} color={'#BB0000'}/>}
                      <span className='font-semibold ml-2'>Simples</span>
                    </div>
                    <div className='flex p-2 bg-[#ededed] rounded items-center justify-center mr-2'>
                      {modalData?.['company_id_pre_payments.is_service'] == true ? <AiOutlineCheckCircle size={20} color={'#18BA18'}/> : <AiOutlineCloseCircle size={20} color={'#BB0000'}/>}
                      <span className='font-semibold ml-2'>Fornece Serviços</span>
                    </div>
                    <div className='flex p-2 bg-[#ededed] rounded items-center justify-center'>
                      {modalData?.['company_id_pre_payments.is_product'] == true ? <AiOutlineCheckCircle size={20} color={'#18BA18'}/> : <AiOutlineCloseCircle size={20} color={'#BB0000'}/>}
                      <span className='font-semibold ml-2'>Fornece Produtos</span>
                    </div>
                  </div>
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

        {
          prePaymentData.length > 0 ?
            <div className={PrePaymentStyle.ItemsBody}>
              {prePaymentData.map(prePaymentDataCallback => {
                return (
                  <PrePaymentItem
                    img={prePaymentDataCallback.tax_note_link}
                    city={prePaymentDataCallback['city_id_pre_payments.label']}
                    state={prePaymentDataCallback['city_id_pre_payments.city_uf_id.label']}
                    date={moment(prePaymentDataCallback.createdAt).format('DD/MM/YYYY')}
                    tax_note={prePaymentDataCallback.tax_note}
                    data={prePaymentDataCallback}
                    modalData={modalData}
                    setData={setModalData}
                    computers={computerData}
                    computerSelected={computerSelected}
                    setComputer={setComputerData}
                    setComputerSelected={setComputerSelected}
                    onClick={openAndCloseModal}
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