import axios from 'axios';


const token = localStorage.getItem('user-token');


const isHandlerEnabled = true;

const errorHandler = (error) => {
  if (isHandlerEnabled) {
    console.log(error);
  }
  return Promise.reject({ ...error });
};

const successHandler = (response) => {
  if (isHandlerEnabled) {
    console.log(response);
  }
  return response;
};


export const HTTP = axios.create({
  baseURL: 'https://rhzc.ru/api/',
  timeout: 5000,
  headers: (token === null) ? {} : { Authorization: `Token ${token}` },
});

HTTP.interceptors.response.use(
  (response) => successHandler(response),
  (error) => errorHandler(error),
);
