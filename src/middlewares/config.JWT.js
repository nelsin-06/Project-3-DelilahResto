const config = require('../config');
const expressJWT = require("express-jwt");
require('dotenv').config();

const configJWT = () => expressJWT({
    secret: config.JWT.PASSJWT,
    algorithms: ['HS256'],
}).unless({
    path: ['/usuarios/ingresar', '/usuarios/registrar', '/health-check'],
});

module.exports = configJWT;
