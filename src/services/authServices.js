import api from '../config/api';
import { ValidateSession } from './validateSession';

const registerService = async (params) => {
  try {
    let response = await api.post('/auth/register', params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const loginService = async (params) => {
  try {
    let response = await api.post('/auth/login', params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    throw new Error(error?.response?.status);
  }
}

const getUfService = async (params) => {
  try {
    let response = await api.get('/city/get-all-uf');
    return response.data;
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const getCityService = async (params) => {
  try {
    let response = await api.post('/city/get-all-City', params);
    return response.data;
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const getComputersService = async (params) => {
  try {
    let response = await api.post('/user/get-computers', params);
    return response.data;
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const getUserInformations = async (params) => {
  try {
    let response = await api.post('/user/me');
    return response.data;
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const getTokenToRecoverPassword = async (params) => {
  try {
    let response = await api.post('/auth/send-recovery-token', params);
    return response.data;
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const RecoverPassword = async (params) => {
  try {
    let response = await api.post('/auth/recovery-phrase', params);
    return response.data;
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const VerifyCompanyAccess = async (params) => {
  try {
    let response = await api.post('/auth/verify-access', params);
    return response.data;
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const UpdatePhraseCompany = async (params) => {
  try {
    let response = await api.post('/auth/update-password-company', params);
    return response.data;
  } catch(error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const LoginCompany = async (params) => {
  try {
    let response = await api.post('/auth/login-company', params);
    return response.data;
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

export { registerService, loginService, getUfService,
  getCityService, getComputersService, getUserInformations,
  getTokenToRecoverPassword, RecoverPassword, VerifyCompanyAccess,
  UpdatePhraseCompany, LoginCompany
}

