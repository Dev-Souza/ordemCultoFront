import axios from "axios";

const ordemCulto = axios.create({
    baseURL: 'https://ordemculto.onrender.com'
});

export default ordemCulto;