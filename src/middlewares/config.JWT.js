const expressJWT = require("express-jwt");
const config = require('../config');

const configJWT = () => expressJWT({
    secret: config.JWT.PASSJWT,
    algorithms: ['HS256'],
}).unless({
    path: ['/usuarios/ingresar', '/usuarios/registrar', '/health-check'],
});

module.exports = configJWT;
