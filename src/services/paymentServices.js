import api from '../config/api';
import { ValidateSession, ValidateCompanySession } from './validateSession';

const getAllProductsOrServices = async (params) => {
  try {
    let response = await api.get('/product-service/get-all', params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const savePayment = async (params) => {
  try {
    let response = await api.post('/payments/create', params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const getPayment = async (params) => {
  try {
    let response = await api.post('/payments/get-payment-info', params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const getCompanyPayment = async (params) => {
  try {
    let response = await api.post('/payments/get-company-payment-info', params);
    return response.data
  } catch (error) {
    ValidateCompanySession(error.response.status);
    return error.response.status;
  }
}

const getComputers = async (params) => {
  try {
    let response = await api.post('/user/get-user-computers', params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const getPayments = async (params) => {
  try {
    let response = await api.post('/user/me');
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const searchCompanyByCNPJ = async (params) => {
  try {
    let response = await api.post(`/company/company-search?cnpj=${params.cnpj}`, params.body);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const getSecretaryPayments = async (params) => {
  try {
    let response = await api.post(`/user/secretary-panel?currentPage=${params.currentPage}&pageSize=9`);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error?.response?.status;
  }
}

const confirmPaymentService = async (params) => {
  try {
    let response = await api.post(`/payments/confirm-payment`, params );
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const getAllPaymentsByCityAndDate = async (params) => {
  try {
    let response = await api.post(`/payments/get-all-payments-by-date?pageSize=10&currentPage=${params.pageCount}`, params );
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const getGrossBalanceByCityAndDate = async (params) => {
  try {
    let response = await api.post(`/user/total-values`, params );
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const getProductServiceDiscountByCityId = async (params) => {
  try {
    let response = await api.post(`/product-service/get-products-services-discount`, params );
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const findCompanyByCNPJ = async (params) => {
  try {
    let response = await api.post(`/company/cnpj-finder?cnpj=${params.cnpj}`,);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    throw new Error(error.response.status);
  }
}

const enablePayment = async (params) => {
  try {
    let response = await api.post(`/payments/enable-payment`, params);
    return response.data;
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const disablePayment = async (params) => {
  try {
    let response = await api.post(`/payments/disable-payment`, params);
    return response.data;
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const sendEmailToCompany = async (params) => {
  try {
    let response = await api.post(`/payments/send-email`, params);
    return response.data;
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const getPaymentReciboInfo = async (params) => {
  try {
    let response = await api.post(`/payments/payment-information`, params);
    return response.data;
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const updatePayment = async (params) => {
  try {
    let response = await api.post(`/payments/associate-payment`, params);
    return response.data;
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const searchPaymentByTaxNote = async (params) => {
  try {
    let response = await api.post(`/payments/payment-search?cnpj=${params.cnpj}`, params.body);
    return response.data;
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const updatePaymentStatus = async (params) => {
  try {
    let response = await api.post(`/payments/update-status`, params);
    return response.data;
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const getAllPaymentsByDate = async (params) => {
  try {
    let response = await api.post(`/payments/get-all-payments?pageSize=10&currentPage=${params.pageCount}`, params);
    return response.data;
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const searchPaymentByCnpj = async (params) => {
  try {
    let response = await api.post(`/payments/payment-search-by-cnpj?cnpj=${params.cnpj}`, params);
    return response.data;
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const delelePayment = async (params) => {
  try {
    let response = await api.post(`/payments/delete-payment`, params);
    return response.data;
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const generateDamService = async (params) => {
  try {
    let response = await api.post(`/payments/generate-dam`, params);
    return response.data;
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const getComputersByCity = async (params) => {
  try {
    let response = await api.post(`/user/get-computers`, params);
    return response.data;
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}


export { getAllProductsOrServices,
  savePayment, getPayment, getComputers,
  getPayments, searchCompanyByCNPJ, getSecretaryPayments,
  confirmPaymentService, getAllPaymentsByCityAndDate,
  getGrossBalanceByCityAndDate, getProductServiceDiscountByCityId,
  findCompanyByCNPJ, enablePayment, disablePayment, sendEmailToCompany,
  getPaymentReciboInfo, updatePayment, searchPaymentByTaxNote, updatePaymentStatus,
  getAllPaymentsByDate, searchPaymentByCnpj, delelePayment, generateDamService,
  getComputersByCity, getCompanyPayment
}