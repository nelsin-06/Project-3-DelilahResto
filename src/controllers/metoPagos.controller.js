const payMethods = {};
const metoPagoModelo = require("../models/metodospago.models");
const metodoPagoValidacion = require('../Schemas_joi/metodosPago/metodoPago.Schema');

//Listar metodos de pago.

payMethods.obtenerMetPagos = async (req, res) => {
    res.json(await metoPagoModelo.find())
};

//Agregar metodo de pago.

payMethods.agregarMetPago = async (req, res) => {
    try {
        const { medio } = await metodoPagoValidacion.validateAsync(req.body);
        const verificacion = await metoPagoModelo.findOne({ medio });
        if (verificacion == null) {
            const metNew = await new metoPagoModelo({
                medio
            });
            await metNew.save()
            res.status(201).json(`Se creo el metodo de pago ${medio} exitosamente`)
        } else {
            res.status(400).json('El metodo de pago ya existe');
        };
    } catch (err) {
        if (err.details == undefined) {
            res.status(500).json('INTERNAL SEVER_ERROR=500');
        } else {
            res.status(400).json(res.json(err.details[0].message));
        }
    };
};

//Editar metodo de pago.

payMethods.editarMetPago = async (req, res) => {
    try {
        const { id: _id } = req.params;
        const { medio } = await metodoPagoValidacion.validateAsync(req.body);
        const metPago = await metoPagoModelo.findById({ _id });
        if (metPago == null) {
            res.status(400).json('Id de metodo de pago invalido');
        } else {
            const resultado = await metoPagoModelo.findByIdAndUpdate({ _id }, { "medio": medio });
            res.json(`Se actualizo correctamente el medio de pago a ${medio}`)
        };
    } catch (err) {
        if (err.name == 'CastError') {
            res.json('Id de metodo de pago invalido')
        } else if (err.codeName == 'DuplicateKey') {
            res.status(400).json("El metodo de pago ya existe");
        } else {
            res.status(201).json(res.json(err.details[0].message));
        }
    }
};

//Eliminar metodo de pago.

payMethods.eliminarMetPago = async (req, res) => {
    try {
        const { id: _id } = req.params;
        const metPago = await metoPagoModelo.findOne({ _id });
        if (metPago == null) {
            res.status(400).json('Id de metodo de pago invalido')
        } else {
            const resultado = await metoPagoModelo.findByIdAndDelete({ _id });
            res.status(201).json(`Se elimino correctamente el metodo de pago ${metPago.medio}`)
        };
    } catch (err) {
        if (err.name == 'CastError') {
            res.status(400).json('Id de metodo de pago invalido')
        } else {
            res.status(400).json('INTERNAL SERVER_ERROR=500');
        };
    };
};




module.exports = payMethods;