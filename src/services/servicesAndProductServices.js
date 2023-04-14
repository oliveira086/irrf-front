import api from '../config/api';
import { ValidateSession } from './validateSession';

const getAllProducts = async (params) => {
  try {
    let response = await api.get('/product-service/get-products', params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const getAllServices = async (params) => {
  try {
    let response = await api.get('/product-service/get-services', params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}


export { getAllProducts, getAllServices}