import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from "@chakra-ui/react"

import Login from './pages/Login';
import RecoveryPassword from './pages/RecoveryPasword/StepOne';
import RecoveryPasswordToken from './pages/RecoveryPasword/StepTwo';
import RecoveryPasswordChangePassword from './pages/RecoveryPasword/StepThree';
import RecoveryConfirm from './pages/RecoveryPasword/RecoveryConfirm';
import FinancialRegister from './pages/Register/FinancialRegister';
import FiscalRegister from './pages/Register/FiscalRegister';
import RegisterConfirm from './pages/Register/RegisterConfirm';
import HomeAdmin from './pages/HomeAdmin';
import PrePayment from './pages/PrePayments';
import Payments from './pages/Payments';
import AdminPanel from './pages/AdminPanel';
import AdminSupplier from './pages/AdminSupplier';
import Home from './pages/Home';
import Holding from './pages/Holding';
import FiscalPanel from './pages/FiscalPanel';
import FiscalDocument from './pages/FiscalDocument';
import FinancialDocument from './pages/FinancialDocument';
import Companies from './pages/Companies';

const theme = extendTheme({
  fonts: {
    body: `'Poppins', sans-serif`,
  }
});

function Router(){
  return(
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path='/' exact element={<Login />} />
          <Route path='/recuperar-senha' exact element={<RecoveryPassword />} />
          <Route path='/recuperar-senha-token' exact element={<RecoveryPasswordToken />} />
          <Route path='/alterar-senha' exact element={<RecoveryPasswordChangePassword />} />
          <Route path='/confirmacao-recuperacao' exact element={<RecoveryConfirm />} />
          <Route path='/cadastro-financeiro' exact element={<FinancialRegister />} />
          <Route path='/cadastro-fiscal' exact element={<FiscalRegister />} />
          <Route path='/cadastro-confirmado' exact element={<RegisterConfirm />} />
          <Route path='/home-admin' exact element={<HomeAdmin />} />
          <Route path='/home' exact element={<Home />} />
          <Route path='/pre-pagamentos' exact element={<PrePayment />} />
          <Route path='/pagamentos' exact element={<Payments />}/>
          <Route path='/painel-administrativo' exact element={<AdminPanel />} />
          <Route path='/painel-fornecedores' exact element={<AdminSupplier />} />
          <Route path='/retencao' exact element={<Holding />} />
          <Route path='/painel-fiscal' exact element={<FiscalPanel />} />
          <Route path='/extrato-fiscal' exact element={<FiscalDocument />} />
          <Route path='/despacho' exact element={<FinancialDocument />} />
          <Route path='/fornecedores' exact element={<Companies />}/>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  )
} 

export default Router;