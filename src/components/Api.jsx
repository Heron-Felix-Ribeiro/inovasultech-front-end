import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const SwalApi = withReactContent(Swal);

const Api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

Api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    console.log("Token encontrado:", token);
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log("Token não encontrado");
  }
  return config;
}, (error) => {
  console.error("Erro na configuração da requisição:", error);
  return Promise.reject(error);
});

Api.interceptors.response.use((response) => {
  console.log("Resposta da API:", response);
  return response;
}, (error) => {
  console.error("Erro na resposta da API:", error);

  const handleError = async (message, shouldRedirect = false) => {
    await SwalApi.fire({
      title: 'Erro',
      text: message,
      icon: 'error',
      showConfirmButton: true,
      allowOutsideClick: false,
      timer: 5000,
      timerProgressBar: true,
      didClose: () => {
        if (shouldRedirect) {
          window.location.href = "/";  
        }
      }
    });
  };

  if (error.response) {
    if (error.response.status === 401) {
      handleError('Token inválido ou expirado', true);
    } else {
      handleError(error.response.data?.messages || 'Ocorreu um erro');
    }
  } else if (error.request) {
    handleError('Erro na requisição. Por favor, tente novamente.');
  } else {
    handleError(`Erro desconhecido: ${error.message}`);
  }

  return Promise.reject(error);
});

export default Api;
