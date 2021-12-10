const router = require('express').Router();
const esAdmin = require('../middlewares/esAdmin');
const estadoUser = require('../middlewares/usuarioSuspendido');
const { 
    obtenerUsuarios,
    registrarUsuario, 
    login, 
    obtenerMiCuenta,
    agregarDireccion,
    eliminarDireccion,
    suspenderUsuario
} = require('../controllers/usuarios.controller');

/**
 * @swagger
 * /usuarios/obtenerusuarios:
 *  get:
 *      summary: Obtener todos los usuarios registrados (ADMIN)
 *      description: Obtener todos los usuarios regitrados.
 *      tags: [USUARIOS]
 *      schema:
 *      responses:
 *          200:
 *              description: Lista de todos los usuarios registrados.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/obtenerusuarios'
 */
router.get('/obtenerusuarios', estadoUser, esAdmin ,obtenerUsuarios);
/**
 * @swagger
 * /usuarios/ingresar:
 *  post:
 *      summary: Ingresar al sistema
 *      description: Hacer login con email y password previamente registrado
 *      tags: [USUARIOS]
 *      security: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/login'
 *      responses:
 *          201:
 *              description: Inicio de sesion exitoso.
 *              content:
 *                  aplication/json:
 *                      schema:
 *                          type: string
 *                          example: inicio de sesion exitoso.
 *          401:
 *              description: Uncauthorized.
 *              content:
 *                  aplication/json:
 *                      schema:
 *                          type: string
 *                          example: Unauthorized.
 * 
 */

router.post("/ingresar", login);

/**
 * @swagger
 * /usuarios/micuenta:
 *  get:
 *      summary: Obtener los datos de mi cuenta.
 *      description: Obtener los datos de mi cuenta logueada.
 *      tags: [USUARIOS]
 *      schema:
 *      responses:
 *          200:
 *              description: Datos de mi logueada.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/micuenta'
 */
router.get('/micuenta', obtenerMiCuenta)

/**
 * @swagger
 * /usuarios/registrar:
 *  post:
 *      summary: Ingresar un nuevo usuario al sistema
 *      description: Ingresar datos para la creacion de un usuario nuevo.
 *      tags: [USUARIOS]
 *      security: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/register'
 *      responses:
 *          201:
 *              description: Usuario creado exitosamente
 *              content:
 *                  aplication/json:
 *                      schema:
 *                          type: string
 *                          example: "USUARIO CREADO Username: username prueba Email: correoprueba123@gmail.com"
 *          400:
 *              description: Posibles errores lanzados por la API por error en la sintaxis y/o requisitos para hacer un registo exitoso.
 *              content:
 *                  aplication/json:
 *                      schema:
 *                          type: string
 *                          example: El email ya se encuentra registrado - correo invalido - username invalido - username debe tener una logitud minima - caracteres no permitidos en la password.
 */             
router.post("/registrar", registrarUsuario);


/**
 * @swagger
 * /usuarios/aggdireccion:
 *  post:
 *      summary: Ingresar una nueva direccion a la libreta
 *      description: Ingresar una nueva direccion a la libreta del usuario previamente registrado.
 *      tags: [USUARIOS]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/aggdireccion'
 *      responses:
 *          201:
 *              description: Direccion creada exitosamente
 *              content:
 *                  aplication/json:
 *                      schema:
 *                          type: object
 *                          example: {direccion: "calle nueva #12-12, id: 1234"}
 *          400:
 *              description: Posibles errores lanzados por la API por incidencias en la sintaxis y/o requisitos necesarios para realizar la solicitud. 
 *              content:
 *                  aplication/json:
 *                      schema:
 *                          type: string
 *                          example: Id de usuario invalido.
 */             

router.post("/aggdireccion", estadoUser, agregarDireccion);

/**
 * @swagger
 * /usuarios/deldireccion:
 *  delete:
 *      summary: Eliminar una direccion a la libreta del usuario
 *      description: Eliminar direccion registrada en la libreta del usuario.
 *      tags: [USUARIOS]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/deldireccion'
 *      responses:
 *          201:
 *              description: Direccion eliminada exitosamente
 *              content:
 *                  aplication/json:
 *                      schema:
 *                          type: string
 *                          example: Direccion eliminada.
 *          400:
 *              description: Posibles errores lanzados por la API por incidencias en la sintaxis y/o requisitos necesarios para realizar la solicitud. 
 *              content:
 *                  aplication/json:
 *                      schema:
 *                          type: string
 *                          example: Id de usuario invalido - No hallamos el id en la lista de direcciones.
 */
router.delete("/deldireccion", estadoUser, eliminarDireccion);

/**
 * @swagger
 * /usuarios/cambiarestado/{IdDeUsuario}:
 *  post:
 *      summary: Eliminar una direccion a la libreta del usuario (ADMIN)
 *      description: Eliminar direccion registrada en la libreta del usuario.
 *      tags: [USUARIOS]
 *      parameters:
 *        - in: path
 *          name: IdDeUsuario
 *          required: true
 *          schema:
 *              type: string
 *              example: asd123
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/cambiarestado'
 *      responses:
 *          201:
 *              description: Cambio de estado del usuario exitoso
 *              content:
 *                  aplication/json:
 *                      schema:
 *                          type: string
 *                          example: Se modifico el estado del usuario
 *          400:
 *              description: Posibles errores lanzados por la API por incidencias en la sintaxis y/o requisitos necesarios para realizar la solicitud. 
 *              content:
 *                  aplication/json:
 *                      schema:
 *                          type: string
 *                          example: Id de usuario invalido - Solo se admite estado de usuario true o false
 */
router.post('/cambiarestado/:id', estadoUser, esAdmin, suspenderUsuario)

/**
 * @swagger
 * tags:
 *  name: USUARIOS
 *  description: Seccion dedicada a "USUARIOS"
 * 
 * components:
 *  schemas:
 *      cambiarestado:
 *          type: object
 *          rquire:
 *              - estadousuario
 *          properties:
 *              estadousuario:
 *                  type: boolean
 *                  description: Estado al cual se desea poner al usuario
 *          example: 
 *              estadousuario: true
 *      deldireccion:
 *          type: object
 *          require:
 *              - id
 *          properties:
 *              id:
 *                  type: number
 *                  description: Id de la direccion a eliminar.
 *      aggdireccion:
 *          type: object
 *          require:
 *              - nuevaDireccion
 *          properties:
 *              nuevaDireccion:
 *                  type: string
 *                  description: Nueva direccion a agregar a la libreta de direcciones del usuario.
 *      usuariologin:
 *          type: object
 *          require:
 *              -email
 *              -password
 *          properties:
 *              email:
 *                  type: string
 *                  description: Email del usuario.
 *              password:
 *                  type: string
 *                  description: Password del usuario.    
 *      obtenerusuarios:
 *          type: object
 *          require:
 *              -email
 *              -username
 *              -password
 *              -isAdmin
 *              -telefono
 *              -direccion
 *              -id
 *              -estado
 *          properties:
 *              email:
 *                  type: string
 *                  description: Email del usuario.
 *              username:
 *                  type: string
 *                  description: Username del usuario.
 *              password:
 *                  type: string
 *                  description: Password del usuario.
 *              isAdmin:
 *                  type: boolean
 *                  description: Tiene permisos de administrador TRUE/FALSE.
 *              telefono:
 *                  type: integer
 *                  description: Telefono del usuario.
 *              direccion:
 *                  type: array
 *                  description: Libreta de direcciones del usuario.
 *              id:
 *                  type: string
 *                  description: Id unico del usuario.
 *              estado:
 *                  type: boolean
 *                  description: La cuenta esta en estado activa o suspendida.
 *          example:
 *              email: correoprueba123@gmail.com
 *              username: username prueba
 *              password: passencriptada
 *              isAdmin: false
 *              telefono: 3999999919
 *              direccion: [{direccion: "calle prueba #9-99"}]
 *              id: da7s8dhasiausfn7823f
 *              estado: true
 *      micuenta:
 *          type: object
 *          require:
 *              -email
 *              -username
 *              -password
 *              -isAdmin
 *              -telefono
 *              -direccion
 *              -id
 *              -estado
 *          properties:
 *              email:
 *                  type: string
 *                  description: Email del usuario
 *              username:
 *                  type: string
 *                  description: Username del usuario.
 *              password:
 *                  type: string
 *                  description: Password del usuario.
 *              isAdmin:
 *                  type: boolean
 *                  description: Tiene permisos de administrador TRUE/FALSE.
 *              telefono:
 *                  type: integer
 *                  description: Telefono del usuario.
 *              direccion:
 *                  type: array
 *                  description: Libreta de direcciones del usuario.
 *              id:
 *                  type: string
 *                  description: Id unico del usuario.
 *              estado:
 *                  type: boolean
 *                  description: La cuenta esta en estado activa o suspendida.
 *          example:
 *              email: correoprueba123@gmail.com
 *              username: username prueba
 *              password: passEncriptada
 *              isAdmin: false
 *              telefono: 3999999919
 *              direccion: [{direccion: "calle prueba #9-99"}]
 *              id: da7s8dhasiausfn7823f
 *              estado: true
 *      login:
 *          type: object
 *          required:
 *              - email
 *              - password
 *          properties:
 *              email:
 *                  type: string
 *                  description: Email del usuario.
 *              password:
 *                  type: string
 *                  description: Password del usuario.
 *          example:
 *              email: "correo1@gmail.com"
 *              password: "passwordsecreto"
 *      register:
 *          type: object
 *          required:
 *              - email
 *              - username
 *              - password
 *              - confirm_password
 *              - telefono
 *              - direccion
 *          properties:
 *              email:
 *                  type: string
 *                  description: email del usuario nuevo.
 *              username:
 *                  type: string
 *                  description: Username del usuario nuevo.
 *              password:
 *                  type: string
 *                  description: Password del usuario nuevo.
 *              confirm_password:
 *                  type: string
 *                  description: Confirmacion del password del usuario nuevo.
 *              telefono:
 *                  type: number
 *                  description: Numero de telefono usuario nuevo
 *              direccion:
 *                  type: string
 *                  description: Direccion del usuario nuevo.
 *          example:
 *              email: "correoprueba123@gmail.com"
 *              username: "username prueba"
 *              password: "passwordsecreto"
 *              confirm_password: "passwordsecreto"
 *              telefono: "3129999919"
 *              direccion: [{direccion: "calle prueba #9-99"}]
 *                  
 */
module.exports = router;