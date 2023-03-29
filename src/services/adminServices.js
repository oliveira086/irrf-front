import api from '../config/api';

const getAllUsersByAdmin = async (params) => {
  try {
    let response = await api.post('/user/manager', params);
    return response.data
  } catch (error) {
    return error.response.status;
  }
};

const unlockUserService = async (params) => {
  try {
    let response = await api.post('/user/user-access', params);
    return response.data
  } catch (error) {
    return error.response.status
  }
};

const getAllCitiesRegisted = async () => {
  try {
    let response = await api.post('/city/get-all-cities-admin', {});
    return response.data
  } catch (error) {
    return error.response.status
  }
}

export { getAllUsersByAdmin, unlockUserService, getAllCitiesRegisted }