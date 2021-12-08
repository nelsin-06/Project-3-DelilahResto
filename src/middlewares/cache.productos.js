const clienteRedis = require('../helpers/conexionRedis');

const cache = async (req, res, next) => {
    try {
        const productos = await clienteRedis.get('PRODUCTOS');
        if (productos) {
            res.status(200).json(JSON.parse(productos));
        } else {
            next();
        }
    } catch (err) {
    if (err) throw err;
    console.log(err);
    res.status(500).json('INTERNAL SEVER ERROR=500')
};
}

module.exports = cache;