const { default: axios } = require("axios");

const ordemCulto = axios.create({
    baseURL: import.meta.env.CHAVE_API
})

export default ordemCulto