import api from '../config/api';
import { ValidateSession } from './validateSession';

const getAllReinfCodes = async (params) => {
  try {
    let response = await api.get('/reinf/get-reinf-codes', params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const get4020Informations = async (params) => {
  try {
    let response = await api.post('/reinf/get-r4020-payment', params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

export { getAllReinfCodes, get4020Informations }