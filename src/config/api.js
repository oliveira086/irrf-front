const axios = require('axios');
const ambient = 'prod'

const Cookies = require('universal-cookie').default;

function getToken () {
  const cookies = new Cookies();
  const bearerToken = cookies.get('@IRRF:bearerToken');
  return bearerToken;
}

var axiosInstance = axios.create({
  baseURL: ambient === 'dev' ? 'http://localhost:8082' : 'https://api-dev.cefitem.net',
  "Authorization": `Bearer ${getToken()}`
});

axiosInstance.interceptors.request.use(
  request => {
    const headers = {
      locale: 'pt-br',
      accept: '*/*',
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*",
      "Authorization": `Bearer ${getToken()}`
    };

    if (request.url.includes('files')) {
      headers.accept = '*/*'
      headers.ContentType = 'multipart/form-data'
    };

    request.headers = headers;
    return request;
  },
  err => {
    Promise.reject(err);
  }
);


module.exports = axiosInstance;
