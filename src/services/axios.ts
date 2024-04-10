import Axios from 'axios';

const axiosInit = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosInit.interceptors.request.use(function (config) {
  return config;
});

// Add a response interceptor
axiosInit.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger

    // return default error if no response from server
    if (!error.response) {
      return Promise.reject(error.message);
    }

    // construct error message based on error usecase
    let errorMessage: string = error.message;

    if (/network/i.test(errorMessage)) {
      errorMessage = 'Please check your internet connection and try again.';
      return Promise.reject(errorMessage);
    }
    // user errors if available

    if (error.response.status === 401) {
      errorMessage = 'Access Denied';
      return Promise.reject(errorMessage);
    }

    if (error.response) {
      if (error.response.data.message) {
        errorMessage = error.response.data.message;
        return Promise.reject(errorMessage);
      }

      return Promise.reject(error.response.data);
    }

    return Promise.reject(errorMessage);
  }
);

export default axiosInit;
