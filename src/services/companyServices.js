import api from '../config/api';

const createCompany = async (params) => {
  try {
    let response = await api.post('/company/register', params);
    return response.data
  } catch (error) {
    return error.response.status;
  }
};

const getAllCompanies = async (params) => {
  try {
    let response = await api.post(`/company/get-all-companies?currentPage=${params.currentPage}&pageSize=9`);
    return response.data
  } catch (error) {
    return error.response.status;
  }
};

const getCompanyByCnpj = async (params) => {
  try {
    let response = await api.post(`/company/get-companies-by-cnpj`, params);
    return response.data
  } catch(error) {
    return error.response.status;
  }
};

const getCompanyByProductServices = async (params) => {
  try {
    let response = await api.post(`/company/get-company-by-product-services`, params);
    return response.data
  } catch (error) { 
    return error.response.status;
  }
}

const uploadReceiptCompany = async (params, id) => {
  try {
    let response = await api.post(`/company/upload-contract?id=${id}`, params, {
      headers: {"Content-Type": undefined}
    });
    return response.data
  } catch (error) { 
    return error.response.status;
  }
}

const getCompanyById = async (params) => {
  try {
    let response = await api.post(`/company/get-company-by-id`, params);
    return response.data
  } catch (error) { 
    return error.response.status;
  }
}

const editCompany = async (params) => {
  try {
    let response = await api.post(`/company/edit`, params);
    return response.data
  } catch (error) { 
    return error.response.status;
  }
}

const getAllCompaniesAdmin = async (params, query) => {
  try {
    let response = await api.post(`/company/get-all-companies-admin?currentPage=${query.currentPage}&pageSize=10`, params);
    return response.data
  } catch (error) { 
    return error.response.status;
  }
}

const disableCompany = async (params) => {
  try {
    let response = await api.post(`/company/disable-company`, params);
    return response.data
  } catch (error) { 
    return error.response.status;
  }
}

const setCompanyAudited = async (params) => {
  try {
    let response = await api.post(`/company/enable-company`, params);
    return response.data
  } catch (error) { 
    throw new Error('Erro ao auditar empresa');
  }
}

export { createCompany, getAllCompanies, getCompanyByCnpj,
  getCompanyByProductServices, uploadReceiptCompany, getCompanyById,
  editCompany, getAllCompaniesAdmin, disableCompany, setCompanyAudited
}