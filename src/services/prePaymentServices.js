import api from '../config/api';
import { ValidateSession } from './validateSession';

const getAllPrePayments = async (params) => {
  try {
    let response = await api.get('/pre-payments/get-all-pre-payments', params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const getPrePaymentById = async (params) => {
  try {
    let response = await api.post('/pre-payments/get-pre-payment', params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const updatePrePaymentById = async (params) => {
  try {
    let response = await api.post('/pre-payments/edit', params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    throw new Error(error.response.status);
  }
}

const confirmPrePayment = async (params) => {
  try {
    let response = await api.post('/pre-payments/confirm-pre-payment', params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    throw new Error(error.response.status);
  }
}

const calculePrePayment = async (params) => {
  try {
    let response = await api.post('/pre-payments/pre-payments-calcules', params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    throw new Error(error.response.status);
  }
}

const createPrePayment = async (params) => {
  try {
    let response = await api.post(`/pre-payments/create?phone=${params.phone}&taxNote=${params.taxNote}&cnpj=${params.cnpj}&company_id=${params.company_id}`, params.body, { 
      headers: {"Content-Type": 'multipart/form-data'}
    });
    return response.data;
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const createPrePaymentByCompany = async (params) => {
  try {
    let response = await api.post(`/pre-payments/create-by-company?phone=${params.phone}&taxNote=${params.taxNote}&cnpj=${params.cnpj}&company_id=${params.company_id}`, params.body, { 
      headers: {"Content-Type": 'multipart/form-data'}
    });
    return response.data;
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const getAliquotEfectiveCompany = async (params) => {
  try {
    let response = await api.post('/pre-payments/efective-aliquot', params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    throw new Error(error.response.status);
  }
}

export { getAllPrePayments, getPrePaymentById, updatePrePaymentById, confirmPrePayment, createPrePayment, calculePrePayment, createPrePaymentByCompany, getAliquotEfectiveCompany }