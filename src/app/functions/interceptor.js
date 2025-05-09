// interceptor.js
import axios from 'axios';
import router from './router'; // ajuste conforme sua configuração

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      alert("Sessão expirada, por favor faça login novamente.");
      router.push("/login");
    }
    return Promise.reject(error);
  }
)