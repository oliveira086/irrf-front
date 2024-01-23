import api from '../config/api';
import { ValidateSession } from './validateSession';

const getAllUsersByCity = async (params) => {
  try {
    let response = await api.post('/user/get-users', params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

export { getAllUsersByCity }