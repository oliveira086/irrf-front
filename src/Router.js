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

const theme = extendTheme({
  fonts: {
    body: `'Poppins', sans-serif`,
  },
})

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
          <Route path='/pre-pagamentos' exact element={<PrePayment />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  )
} 

export default Router;