import Cookies from "universal-cookie";

const ValidateSession = (status) => {
  try {
    const cookies = new Cookies();

    if(status == 500 || status == 401) {
      cookies.remove('@IRRF:bearerToken')
      sessionStorage.setItem('role', null);
      window.location.href = '/'
    }
  } catch(error){
    throw new Error(error);
  }
}

const ValidateCompanySession = (status) => {
  try {
    const cookies = new Cookies();

    if(status == 500 || status == 401) {
      cookies.remove('@IRRF:bearerToken')
      sessionStorage.setItem('role', null);
      window.location.href = '/fornecedor'
    }
  } catch(error){
    throw new Error(error);
  }
}

export { ValidateSession, ValidateCompanySession }