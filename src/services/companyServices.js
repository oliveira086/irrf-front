import api from '../config/api';
import { ValidateSession, ValidateCompanySession } from './validateSession';

const createCompany = async (params) => {
  try {
    let response = await api.post('/company/register', params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
};

const registerCompany = async (params) => {
  try {
    let response = await api.post('/company/create-company', params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const getAllCompanies = async (params) => {
  try {
    let response = await api.post(`/company/get-all-companies?currentPage=${params.currentPage}&pageSize=9`, { enabled: params.enabled, city_id: params.cityId });
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
};

const getCompanyByCnpj = async (params) => {
  try {
    let response = await api.post(`/company/get-companies-by-cnpj`, params);
    return response.data
  } catch(error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
};

const findCompanyByCNPJ = async (params) => {
  try {
    let response = await api.post(`/company/cnpj-finder?cnpj=${params?.cnpj}`, { city_id: params?.city_id });
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    throw new Error(error.response.status);
    return error.response.status;
  }
}

const getCompanyByProductServices = async (params) => {
  try {
    let response = await api.post(`/company/get-company-by-product-services`, params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const uploadReceiptCompany = async (params, id) => {
  try {
    let response = await api.post(`/company/upload-contract?id=${id}`, params, {
      headers: { "Content-Type": undefined }
    });
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const getCompanyById = async (params) => {
  try {
    let response = await api.post(`/company/get-company-by-id`, params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const editCompany = async (params) => {
  try {
    let response = await api.post(`/company/edit`, params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const getAllCompaniesAdmin = async (params, query) => {
  try {
    let response = await api.post(`/company/get-all-companies-admin?currentPage=${query.currentPage}&pageSize=10`, params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const disableCompany = async (params) => {
  try {
    let response = await api.post(`/company/disable-company`, params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    return error.response.status;
  }
}

const setCompanyAudited = async (params) => {
  try {
    let response = await api.post(`/company/enable-company`, params);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
    throw new Error('Erro ao auditar empresa');
  }
}

const verifyCompany = async (params) => {
  try {
    let response = await api.post(`/company/company-search?cnpj=${params.cnpj}`, params.body);
    return response.data
  } catch (error) {
    ValidateSession(error.response.status);
  }
}

const companyPanel = async (params) => {
  try {
    let response = await api.post(`/company/company-panel?currentPage=${params.currentPage}&pageSize=10`, params);
    return response.data;
  } catch (error) {
    // ValidateCompanySession(error.response.status);
  }
}

const companyInformations = async (params) => {
  try {
    let response = await api.post(`/company/company-informations`, params);
    return response.data;
  } catch (error) {
    ValidateCompanySession(error.response.status);
  }
}

const getCompanyCities = async (params) => {
  try {
    let response = await api.post(`/company/get-cities`, params);
    return response.data;
  } catch (error) {
    ValidateCompanySession(error.response.status);
  }
}

const companyPaymentSolicitation = async (params) => {
  try {
    let response = await api.post(`/company/payment-solicitation`, params);
    return response.data;
  } catch (error) {
    ValidateCompanySession(error.response.status);
  }
}

const companyPaymentSolicitationFiles = async (params) => {
  try {
    let response = await api.post(`/company/payment-solicitation/upload-files?id=${params.id}&type=${params.type}`, params.body);
    return response.data;
  } catch (error) {
    ValidateCompanySession(error.response.status);
  }
}

const getAllPaymentSolicitations = async (params) => {
  try {
    let response = await api.post(`/company/payment-solicitation/get-all?currentPage=${params.currentPage}&pageSize=10`, params);
    return response.data;
  } catch (error) {
    ValidateCompanySession(error.response.status);
  }
}

export { createCompany, registerCompany, getAllCompanies, getCompanyByCnpj,
  getCompanyByProductServices, uploadReceiptCompany, getCompanyById,
  editCompany, getAllCompaniesAdmin, disableCompany, setCompanyAudited,
  findCompanyByCNPJ, verifyCompany, companyPanel, companyInformations, getCompanyCities,
  companyPaymentSolicitation, companyPaymentSolicitationFiles, getAllPaymentSolicitations
}