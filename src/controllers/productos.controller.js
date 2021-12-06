const ProductMethods = {};
const productoModelo = require('../models/producto.model');
const validationProduct = require('../Schemas_joi/Productos/producto.Schema');
const clienteRedis = require('../helpers/conexionRedis');

//Obtener lista de productos.

ProductMethods.listaProductos = async (req, res) => {
    const productos = await productoModelo.find();
    clienteRedis.setex('PRODUCTOS', 60, JSON.stringify(productos));
    setTimeout(() => { res.json(productos); }, 3000);
};

//Actualizar un producto ya creado

ProductMethods.editarProducto = async (req, res) => {
    try {
        const { id: _id } = req.params;
        const { nombre, precio } = await validationProduct.validateAsync(req.body);
        const prodActualizado = await productoModelo.findByIdAndUpdate(_id, { nombre, precio });
        if (prodActualizado == null) {
            res.status(400).json("Id de producto invalido");
        } else {
            clienteRedis.del('PRODUCTOS');
            res.json(`Producto actualizado: Nombre: ${nombre}, Precio: ${precio}`);
        };
    } catch (err) {
        if (err.name == "CastError") {
            res.status(400).json("Id de producto invalido");
        } else if (err.details == undefined) {
            res.status(500).json("INTERNAL SERVER_ERROR=500")
        } else { res.status(400).json(err.details[0].message) };
    };
}

// Eliminar un producto

ProductMethods.eliminarProducto = async (req, res) => {
    try {
        const { id: _id } = req.params;
        const { nombre, precio } = await productoModelo.findByIdAndDelete({ _id });
        if (nombre == undefined) {
            res.json("Id de producto invalido");
        } else {
            clienteRedis.del('PRODUCTOS');
            res.status(201).json(`Se elimino satisfactoriamente el producto ${nombre} con el precio de ${precio}`)
        };
    } catch (err) {
        res.status(400).json("El id es invalido del producto a eliminar es invalido")
    };
},

//Agregar un nuevo producto.

ProductMethods.agregarProducto = async (req, res) => {
    try {
        const { nombre, precio } = await validationProduct.validateAsync(req.body);
        const productDB = await productoModelo.findOne({ nombre });
        if (productDB == null) {
            const productNew = await new productoModelo({
                nombre,
                precio,
            });
            await productNew.save();
            clienteRedis.del('PRODUCTOS');
            res.status(200).json("El producto " + nombre + " Fue creado exitosamente");
        } else { res.status(400).json("El producto ya se encuentra registrado") };
    } catch (err) {
        if (err.details == undefined) {
            res.status(500).json("INTERNAL SERVER_ERROR=500");
        } else {
            res.status(400).json(err.details[0].message);
        }
    };
};

console.log(ProductMethods);

module.exports = ProductMethods;