const expressJWT = require("express-jwt");
require('dotenv').config();

const configJWT = () => expressJWT({
    secret: process.env.PASS,
    algorithms: ['HS256'],
}).unless({
    path: ['/usuarios/ingresar', '/usuarios/registrar'],
});

module.exports = configJWT;
