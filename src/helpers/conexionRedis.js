const redis = require('redis');

const redisCliente = redis.createClient({
    url: 'rediscachedelilah.bn9b1l.0001.sae1.cache.amazonaws.com:6379',
});

(async () => {
    await redisCliente.connect();
})();

module.exports = redisCliente;