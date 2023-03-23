import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import Select from 'react-select'

import { searchCompanyByCNPJ } from '../../services/paymentServices';
import { getCompanyByCnpj, getCompanyByProductServices } from '../../services/companyServices';

function SelectFilter ({
  selectedValue,
  setSelectedValue,
  setHasProductAndServices,
  setIsProduct,
  setIsService
}) {
  const [data, setData] = useState([]);
  const [company, setCompany] = useState();
  const [productServices, setProductServices] = useState([]);
  const [productServicesSelected, setProductServicesSelected] = useState();
  const [count, setCount] = useState(0);
  
  const promiseOptions = async (inputValue) => { // Metodo que vai no componente de filtro para iniciar a pesquisa da empresa
    const responseCompanies = await searchCompanyByCNPJ({ cnpj: inputValue });
    setData([responseCompanies.body]);
    return data;
  }

  /*
    value: Object - Objeto da empresa que retorna do backend
  */
  const setValueAndGet = async (value) => { // Metodo que consulta o cnpj encontrado e verifica se ele possui mais de 1 produto/serviço
    setCompany(value);
    const responseCompanies = await getCompanyByCnpj({ cnpj: value.cnpj });
    setCount(responseCompanies?.body.length);

    if(responseCompanies?.body.length > 1) {
      setHasProductAndServices(true);
      responseCompanies?.body.map(companiesCallback => {
        productServices.push({ label: companiesCallback['products_services_id_company.label'], value: companiesCallback['products_services_id'] });
      });
    } else {
      setSelectedValue(value);
      setIsProduct(value?.is_product);
      setIsService(value?.is_service);
    }
  };

  const setProductAndServicesValue = async (value) => { //Após ter escolhido o produto / serviço, é realizado uma consulta no backend para trazer a empresa correta.
    setProductServicesSelected(value);
    const getCompany = await getCompanyByProductServices({ cnpj: company?.cnpj, products_services_id: value?.value });
    setSelectedValue(getCompany?.body);
    setIsProduct(getCompany?.body?.is_product);
    setIsService(getCompany?.body?.is_service);
  };

  return (
    <>
      <div>
        <span>Digite o CNPJ da empresa</span>
        <AsyncSelect
          loadOptions={promiseOptions}
          value={company}
          onChange={(value) => setValueAndGet(value)}
        />
      </div>
      { count > 1 ?
        <div>
          <span>Selecione o Produto / Serviço</span>
          <Select
            options={productServices}
            value={productServicesSelected}
            onChange={(value) => setProductAndServicesValue(value)}
          />
        </div>
        :
        <></>
      }
    </>
  );
}

export default SelectFilter;