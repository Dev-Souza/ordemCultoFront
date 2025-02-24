const { default: axios } = require("axios");

const ordemCulto = axios.create({
    baseURL: 'http://localhost:8080/'
})

export default ordemCulto