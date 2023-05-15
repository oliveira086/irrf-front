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

export { getAllUsersByAdmin, unlockUserService, getAllCitiesRegisted }