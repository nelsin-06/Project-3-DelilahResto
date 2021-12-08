require('dotenv').config();
const config = require('./config');
const {configSwaggerServer, configSwaggerSetup, configSwaggerSpecs} = require('./utils/swaggerconfig');
const helmet = require("helmet");
const msgErrorjwt = require("./middlewares/msgErrorJWT");
const configJWT = require('./middlewares/config.JWT')
const express = require('express');
const app = express();
app.use(express.json());
const estadoUser = require('./middlewares/usuarioSuspendido');

const cspDefaults = helmet.contentSecurityPolicy.getDefaultDirectives();
delete cspDefaults['upgrade-insecure-request'];
app.use(helmet({
    contentSecurityPolicy: {directives: cspDefaults}
}));

app.get('/health-check', (req, res) => {res.status(200).send('.')});

require("./database");

const PORT = config.SERVER.PORT || 3020;

app.use('/swagger', configSwaggerServer, configSwaggerSetup(configSwaggerSpecs));
app.use('/', (req, res) => {
    res.status(200).json('');
})

app.use(configJWT());
app.use(msgErrorjwt);

const rutasUsuarios = require("./route/usuarios.route");
const rutasProductos = require("./route/productos.route");
const rutasPedidos = require("./route/pedidos.route");
const rutasPagos = require("./route/metodosdepago.route");

app.use('/metodopagos', estadoUser,rutasPagos);
app.use('/usuarios', rutasUsuarios);
app.use('/productos', estadoUser, rutasProductos);
app.use('/pedidos', estadoUser, rutasPedidos);

app.listen(PORT, () => { console.log("index iniciado en el puerto: " + PORT); });

module.exports = app;

// ⛩️⚙️💻⛩️