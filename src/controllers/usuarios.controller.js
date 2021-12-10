const UsersMethods = {};
const usuarioModelo = require("../models/usuario.model");
const usuarioValidation = require("../Schemas_joi/Usuarios/usuarioRegistro.Schema");
const loginValidation = require("../Schemas_joi/Usuarios/usuarioLogin.Schema");
const JWT = require("jsonwebtoken");
const { encryptPassword, matchPassword } = require('../helpers/bcrypt.methods');
const eliminarDireccionUsuario = require('../helpers/eliminarDireccion');

//Listar todos los usuarios.

UsersMethods.obtenerUsuarios = async (req, res) => {
        try {
            res.json(await usuarioModelo.find());
        } catch (err) {
            res.status(500).json("A OCURRIDO UN ERROR - 500 INTERNAL ERROR");
        };
};

//Registrar un nuevo usuario.

UsersMethods.registrarUsuario = async (req, res) => {
    try {
        const { email, username, password, telefono, direccion } = await usuarioValidation.validateAsync(req.body);
        if (direccion[0] == undefined || direccion[0].direccion == undefined) {
            res.status(400).json('Se debe ingresar una direccion valida');
        } else {
            direccion[0].id = Math.floor((Math.random() * (300 - 100 + 1)) + 100);
            const verificacion = await usuarioModelo.findOne({ email });
            if (verificacion == null) {
                const userNew = await new usuarioModelo({
                    email,
                    username,
                    password,
                    telefono,
                    direccion
                });
                userNew.password = await encryptPassword(password);
                await userNew.save();
                res.status(201).json(`USUARIO CREADO Username: ${userNew.username} Email: ${userNew.email}`);
            } else {
                res.status(400).json("El email ya se encuentra registrado");
            };
        }
    } catch (err) {
        if (err.details == undefined) {
            res.status(500).json("INTERNAL SERVER_ERROR=500")
        }
        else if (err.details[0].type == "any.only") {
            res.status(400).json("Las contrasenas no coinciden");
        } else { res.status(400).json(err.details[0].message) };
    };
};

//Ingresar al sistema - Hacer login

UsersMethods.login = async (req, res) => {
    try {
        const { email, password } = await loginValidation.validateAsync(req.body);
        const { password: pass, username } = await usuarioModelo.findOne({ email });
        const verificacion = await matchPassword(password, pass);
        if (verificacion) {
            const token = JWT.sign({ username, email }, process.env.PASS);
            res.status(200).json({ token });
        } else {
            res.status(401).json("Unauthorized");
        };
    } catch (err) {
        res.status(401).json("Unauthorized")
    }
};

//Obtener datos de mi cuenta

UsersMethods.obtenerMiCuenta = async (req, res) => {
    try {
        const { email } = req.user;
        res.status(200).json(await usuarioModelo.findOne({ email }));
    } catch (err) {
        res.status(500).json("A OCURRIDO UN ERROR - 500 INTERNAL ERROR");
    };
};

//Agregar una direccion a mi cuenta - agregar direccion a mi libreta de direcciones.

UsersMethods.agregarDireccion = async (req, res) => {
    try {
        const { email } = req.user;
        const nuevaDireccion = req.body;
        const user = await usuarioModelo.findOne({ email });
        if (user == null){
            res.status(400).json('Id de usuario invalido');
        } else {
        nuevaDireccion.id = Math.floor((Math.random() * (300 - 100 + 1)) + 100);
        user.direccion.push(nuevaDireccion);
        await user.save();
        res.json(nuevaDireccion);
    };
    } catch (err) {
        res.status(500).json("INTERNAL SERVER ERROR_500")
    }
};

// Eliminar direccion de la libreta.

UsersMethods.eliminarDireccion = async (req, res) => {
    try {
        const { email } = req.user;
        const { id } = req.body;
        const user = await usuarioModelo.findOne({ email });
        if (user == null){
            res.status(400).json('Id de usuario invalido');
        } else {
        const verificacion = eliminarDireccionUsuario(user.direccion, id);
        if (verificacion != false) {
            await user.save();
            res.json("Direccion Eliminada");
        } else {
            res.json("No hallamos el id en la lista de direcciones");
        };
    }} catch (err) {
        res.json("INTERNAL SERVER ERR0R_500");
    };
};

UsersMethods.suspenderUsuario = async (req, res) => {
    const { id: _id } = req.params;
    const { estadousuario } = req.body;
    await usuarioModelo.findByIdAndUpdate({ _id }, 
        {"estado": estadousuario} ,(err, dato) => {if (dato) {return res.status(201).json('Se modifico el estado del usuario')
} else if (err.valueType == "string" || err.valueType == "number") {return res.status(400).json('Solo se admite estado de usuario true o false')
} else {return res.status(400).json('Id de usuario invalido')}});
};

module.exports = UsersMethods;