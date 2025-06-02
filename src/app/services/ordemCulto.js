const { default: axios } = require("axios");

const ordemCulto = axios.create({
    baseURL: process.env.CHAVE_API
})

export default ordemCulto