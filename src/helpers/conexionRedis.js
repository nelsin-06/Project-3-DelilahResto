const redis = require('redis');
let puertoRedis = process.env.PUERTO_REDIS;
puertoRedis = parseInt(puertoRedis)
const clienteRedis = redis.createClient(puertoRedis);

module.exports = clienteRedis;