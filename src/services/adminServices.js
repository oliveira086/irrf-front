import api from '../config/api';
import { ValidateSession } from './validateSession';

const getAllUsersByAdmin = async (params) => {
  try {
    let response = await api.post('/user/manager', params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
};

const unlockUserService = async (params) => {
  try {
    let response = await api.post('/user/user-access', params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status
  }
};

const getAllCitiesRegisted = async () => {
  try {
    let response = await api.get('/city/get-all-cities-admin', {});
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status
  }
}

const getComputersByCity = async (params) => {
  try {
    let response = await api.post('/user/get-computers', params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status
  }
}

const registerComputer = async (params) => {
  try {
    let response = await api.post('/city/register-computer', params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status
  }
}

export { getAllUsersByAdmin, unlockUserService, getAllCitiesRegisted, getComputersByCity, registerComputer }