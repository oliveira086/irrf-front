import Cookies from "universal-cookie";

const ValidateSession = (status) => {
  try {
    const cookies = new Cookies();

    if(status == 500) {
      cookies.set('@IRRF:bearerToken', null);
      sessionStorage.setItem('role', null);
      window.location.href = '/'
    }
  } catch(error){
    throw new Error(error);
  }
}

export { ValidateSession }