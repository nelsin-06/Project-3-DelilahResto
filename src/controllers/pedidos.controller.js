const orderMethods = {};
const pedidoValidation = require("../Schemas_joi/pedidos/pedidosCrear.Schema");
const pedidoEditValidation = require('../Schemas_joi/pedidos/pedidoEdit.Schemas');
const pedidoDelValidacion = require('../Schemas_joi/pedidos/pedidoDeleProdc.Schema');
const modificarCantidadProducto = require("../helpers/modificarCantidad");
const actualizarPrecioTotal = require("../helpers/precioTotal");
const eliminarProductoDeOrden = require("../helpers/elimiProdtoOrden");
const existeProductoEnLaOrden = require("../helpers/existeElProductoEnLaOrden");
const hallarDireccionUser = require('../helpers/hallarDireccion');
const metoPagoModelo = require('../models/metodospago.models');
const pedidoModelo = require('../models/pedidos.model');
const usuarioModelo = require('../models/usuario.model');
const productoModelo = require('../models/producto.model');

//Realizar un pedido.

orderMethods.realizarPedido = async (req, res) => {
    try {
        const { email } = req.user;
        const { id_producto, cantidad, id_direccion, id_metodo_pago } = await pedidoValidation.validateAsync(req.body);
        const datosPago = await metoPagoModelo.findById({ "_id": id_metodo_pago });
        if (datosPago == null) {
            res.status(400).json("No hallamos el metodo de pago");
        }
        else {
            const datosUsuario = await usuarioModelo.findOne({ email });
            if (datosUsuario == null) {
                res.status(400).json("No hallamos el usuario");
            }
            else {
                const direccionReal = hallarDireccionUser(datosUsuario.direccion, id_direccion);
                if (direccionReal == false) {
                    res.status(400).json("No hallamos la direccion");
                }
                else {
                    const { _id, nombre, precio } = await productoModelo.findById({ "_id": id_producto });
                    if (nombre == null) {
                        res.status(400).json("No hallamos el producto");
                    }
                    else {
                        const precioTotal = precio * cantidad;
                        const nuevoPedido = await new pedidoModelo({
                            "usuario": datosUsuario,
                            "orden": {
                                "_id": _id,
                                "nombre": nombre,
                                "precio": precio,
                                "cantidad": cantidad
                            },
                            "precio_total": precioTotal,
                            "direccion_pedido": direccionReal,
                            "metodo_pago": datosPago
                        });
                        await nuevoPedido.save()
                        res.json(nuevoPedido);
                    }
                }
            }
        };
    } catch (err) {
        if (err.details == undefined) {
            res.status(500).json("INTERNAL ERRRO_500")
        } else {
            res.status(400).json(err.details[0].message);
        }
    };
};

//Listar pedidos de cuenta logueada - listar pedidos de mi cuenta.

orderMethods.obtenerMisPedidos = async (req, res) => {
    const { email } = req.user;
    res.status(200).json(await pedidoModelo.find({ "usuario.email": email }));
};

//Listar todos los pedidos de todos los usuarios.

orderMethods.obtenerTodosLosPedidos = async (req, res) => {
    res.json(await pedidoModelo.find());
};

//Cambiar el estado del pedido a: confirmado, pendiente, en preparacion, entregado, cerrado. (ADMIN)

orderMethods.cambiarEstadoPedido = async (req, res) => { 
    try {
        const { idpedido: _id } = req.params;
        const { estado } = req.body;
        if (estado == "PENDIENTE" || estado == "CONFIRMADO" || estado == "EN PREPARACION" || estado == "ENTREGADO" || estado == "CERRADO") {
            const pedido = await pedidoModelo.findById({ _id });
            pedido.estado_pedido = estado;
            await pedido.save()
            res.json(`El estado del pedido cambio a: ${estado}`);
        } else {
            res.status(400).json("Los estados de pedido validos son: CONFIRMADO, PENDIENTE, EN PREPARACION, ENTREGADO, CERRADO");
        }
    } catch (err) {f
        res.json("Id de pedido invalido");
    };
};

//Usuario cambia el estado del pedido a confirmado.

orderMethods.confirmarPedido = async (req, res) => { 
    try {
        const { idpedido: _id } = req.params;
        const pedido = await pedidoModelo.findById({ _id });
        pedido.estado_pedido = "CONFIRMADO";
        pedido.save();
        res.status(201).json("El estado del pedido paso a CONFIRMADO");
    } catch (err) {
        res.status(400).json("No se hallo el pedido")
    };
};

//Modificar la cantidad de un producto de nuestro pedido.

orderMethods.editarCantidadProducto = async (req, res) => {
    try {
        const { idpedido: _id } = req.params;
        const { idproducto, cantidadproducto } = await pedidoEditValidation.validateAsync(req.body);
        const pedido = await pedidoModelo.findById({ _id });
        if (pedido == null) {
            res.status(400).json("Ingrese un id de pedido valido")
        } else {
            const validacion = modificarCantidadProducto(pedido, idproducto, cantidadproducto);
            if (validacion == false) {
                res.status(400).json("No se hallo el producto en nuestro pedido");
            } else {
                pedido.save()
                res.status(201).json("Cantidad de producto modificada");
            };
        }
    } catch (err) {
        if (err.name == "CastError") {
            res.status(400).json("Ingrese un id de pedido valido");
        } else if (err.details == undefined) {
            res.status(500).json("INTERNAL SERVER_ERROR=500");
        } else {
            res.status(400).json(err.details[0].message);
        };
    };
};

//Eliminar un producto de nuestra orden.

orderMethods.eliminarProducto = async (req, res) => {
    try {
        const { idpedido: _id  } = req.params;
        const { idproducto } = await pedidoDelValidacion.validateAsync(req.body);
        const pedido = await pedidoModelo.findById({ _id });
        if (pedido == null) { return res.status(400).json('Id de pedido invalido')}
        const resultado = eliminarProductoDeOrden(pedido.orden, idproducto);
        if (resultado == false) {
            res.json('No hallamos el producto en el pedido');
        } else {
            actualizarPrecioTotal(pedido);
            await pedido.save();
            res.json("Producto eliminado correctamente");
        };
    } catch (err) {
        if (err.name == "CastError") {
            res.status(400).json("Ingrese un id de pedido valido");
        } else if (err.details == undefined) {
            res.status(500).json("INTERNAL SERVER_ERROR=500");
        } else {
            res.status(400).json(err.details[0].message);
        };
    }
};

//Agregar un nuevo producto al pedido.

orderMethods.agregarNuevoProducto = async (req, res) => {
    try {
        const { idPedido: _id } = req.params;
        const { idproducto, cantidadproducto: cantidad } = await pedidoEditValidation.validateAsync(req.body);
        const pedido = await pedidoModelo.findById({ _id });
        const producto = await productoModelo.findById({ "_id": idproducto })
        if (producto == null) {
            res.status(400).json("No hallamos el producto en el pedido");
        } else {
            const validacion = existeProductoEnLaOrden(pedido, producto.nombre, cantidad);
            if (validacion !== false) {
                await pedido.save()
                res.json("El producto ya se encuentra en el pedido, cantidad aumentada correctamente");
            } else {
                pedido.precio_total += producto.precio * cantidad;
                const objProducto = ({
                    "_id": producto._id,
                    "nombre": producto.nombre,
                    "precio": producto.precio,
                    "cantidad": cantidad
                });
                pedido.orden.push(objProducto);
                actualizarPrecioTotal(pedido);
                await pedido.save();
                res.json("Producto agregado correctamente al pedido");
            };
        };
    } catch (err) {
        if (err.name == "CastError") {
            res.status(400).json("Ingrese un id de pedido valido");
        } else if (err.details == undefined) {
            res.status(500).json("INTERNAL SERVER_ERROR=500");
        } else {
            res.status(400).json(err.details[0].message);
        };
    };
};

module.exports = orderMethods;