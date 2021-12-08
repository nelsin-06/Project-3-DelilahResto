const router = require('express').Router();
const estadoCerrado = require('../middlewares/estadoCerrado');
const esAdmin = require('../middlewares/esAdmin');
const estadoPendiente = require('../middlewares/estadoPendiente');
const {
    realizarPedido,
    obtenerMisPedidos,
    obtenerTodosLosPedidos,
    cambiarEstadoPedido,
    confirmarPedido,
    editarCantidadProducto,
    eliminarProducto,
    agregarNuevoProducto,
} = require('../controllers/pedidos.controller');


/**
 * @swagger
 * /pedidos/realizarpedido:
 *  post:
 *      summary: Realizar un pedido
 *      description: Realice un pedido indicando su producto, cantidad de producto, direccion y su medio de pago.
 *      tags: [PEDIDOS]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/realizarpedido'
 *      responses:
 *          201:
 *              description: Creacion del pedido exitosamente
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: object
 *                          example: {id: asd123, estado_pedido: "PENDIENTE", usuario: {id: asd123, email: "correoprueba@gmail.com", username: "usuario prueba", telefono: "3999123991"}, orden: [{id: asd123, nombre: "Pollo", precio: 5200, cantidad: 2}], precio_total: 10400, direccion_pedido: {id: asd123, direccion: "calle prueba #13-12"}, metodo_pago: {id: asd123, medio: "Nequi"}}
 *          400:
 *              description: Posibles errores lanzados por la API por incidencias en la sintaxis y/o requisitos necesarios para realizar la solicitud.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: No hallamos el metodo de pago - No hallamos el usuario - No hallamos la direccion - No hallamos el producto - datos invalidos.
 *
 */

router.post("/realizarpedido", estadoCerrado, realizarPedido);

/**
 * @swagger
 * /pedidos/mipedido:
 *  get:
 *      summary: Obtener mis pedidos
 *      description: Se obtiene la lista con todos los pedidos que a realizado el usuario logueado
 *      tags: [PEDIDOS]
 *      schema:
 *      responses:
 *          200:
 *              description: Lista de mis pedidos.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/mipedido'
 */
router.get("/mipedido", obtenerMisPedidos);

/**
 * @swagger
 * /pedidos/totalpedidos:
 *  get:
 *      summary: Obtener todos los pedidos de todos los usuarios (ADMIN)
 *      description: Se obtiene una lista con todos los pedidos de todos los usuarios.
 *      tags: [PEDIDOS]
 *      schema:
 *      responses:
 *          200:
 *              description: Lista de todos los pedidos pedidos.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/totalpedidos'
 */
router.get("/totalpedidos", esAdmin, obtenerTodosLosPedidos);

/**
 * @swagger
 * /pedidos/estado/{IdDePedido}:
 *  post:
 *      summary: Cambiar el estado del pedido de un cliente.(ADMIN)
 *      description: Se cambiara el "Estado del pedido" al que el administrador indique
 *      tags: [PEDIDOS]
 *      parameters:
 *        - in: path
 *          name: IdDePedido
 *          required: true
 *          schema:
 *              type: string
 *              example: asd123
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/editar_estado_admin'
 *      responses:
 *          200:
 *              description:
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Es estado del pedido cambio a ENTREGADO.
 *          404:
 *              description: Posibles errores lanzados por la API por incidencias en la sintaxis y/o requisitos necesarios para realizar la solicitud.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Los estados de pedido validos son CONFIRMADO, PENDIENTE, EN PREPARACION, ENTREGADO, CERRADO - Id de pedido invalido
 */
//pendiente, confirmado, en preparacion, entregado, cerrado
router.post("/estado/:idpedido", esAdmin, cambiarEstadoPedido);
/**
 * @swagger
 * /pedidos/estado/{IdDePedido}:
 *  get:
 *      summary: Confirmar y cambiar el estado de mi pedido.
 *      description: El estado del pedido indicado pasa a "CONFIRMADO" y se empieza a preparar.
 *      tags: [PEDIDOS]
 *      parameters:
 *        - in: path
 *          name: IdDePedido
 *          required: true
 *          schema:
 *              type: string
 *              example: asd123
 *      schema:
 *      responses:
 *          201:
 *              description: El usuario cambio exitosamente el estado del pedido a CONFIRMADO
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: El estado del pedido paso a CONFIRMADO
 *          400:
 *              description: Posibles errores lanzados por la API por incidencias en la sintaxis y/o requisitos necesarios para realizar la solicitud..
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: No se hallo el pedido.
 */
router.get("/estado/:idpedido", confirmarPedido);

/**
 * @swagger
 * /pedidos/editarpedido/{IdDePedido}:
 *  put:
 *      summary: Editar la cantidad de un producto en la orden.
 *      description: Editar la cantidad de un producto indicado por Id de nuestro pedido indicado por IdDePedido.
 *      tags: [PEDIDOS]
 *      parameters:
 *        - in: path
 *          name: IdDePedido
 *          required: true
 *          schema:
 *              type: string
 *              example: asd123
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/editarCantidadProducto'
 *      responses:
 *          201:
 *              description: Cantidad de producto modificada exitosamente en el pedido 
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example:
 *                              Cantidad de producto modificada exitosamente
 * 
 *          400:
 *              description: Posibles errores lanzados por la API por incidencias en la sintaxis y/o requisitos necesarios para realizar la solicitud.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example:
 *                              ingrese un id de pedido valido - no se hallo el producto en nuestro pedido - Cantidad de producto invalida
 *                                  
 *          
 */

router.put("/editarpedido/:idpedido", estadoPendiente, editarCantidadProducto);

/**
 * @swagger
 * /pedidos/editarpedido/{IdDepedido}:
 *  delete:
 *      summary: Eliminar un producto de nuestra orden.
 *      description: eliminar un producto ya agregado el cual se indica por Id.
 *      tags: [PEDIDOS]
 *      parameters:
 *        - in: path
 *          name: IdDepedido
 *          required: true
 *          schema:
 *              type: string
 *              example: asd123
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/eliminarProductoDeOrden'
 *      responses:
 *          201:
 *              description: El producto se encontro en el pedido y se elimino
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: No hallamos el producto en el pedido
 *          400:
 *              description: Posibles errores lanzados por la API por incidencias en la sintaxis y/o requisitos necesarios para realizar la solicitud. 
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: No hallamos el producto en el pedido - ingrese un Id de pedido valido
 *          
 */
router.delete("/editarpedido/:idpedido", estadoPendiente, eliminarProducto);

/**
 * @swagger
 * /pedidos/editarpedido/{IdDepedido}:
 *  post:
 *      summary: Agregar un producto a nuestro pedido ya creado.
 *      description: Agregar un producto a un pedido ya creado, si el producto ya esta en el pedido se adiciona la cantidad indicada en la nueva peticion.
 *      tags: [PEDIDOS]
 *      parameters:
 *        - in: path
 *          name: IdDepedido
 *          required: true
 *          schema:
 *              type: string
 *              example: asd123
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/agregarProductoEnOrden'
 *      responses:
 *          201:
 *              description: Se agrego exitosamente el producto nuevo o su cantidad aumento si ya se encontraba en la orden.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Producto agregado correctamente al pedido - El producto ya se encuentra en el pedido, cantidad aumentada correctamente        
 *              
 *          400:
 *              description: Posibles errores lanzados por la API por incidencias en la sintaxis y/o requisitos necesarios para realizar la solicitud.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: No hallamos el producto en el pedido - ingrese un id de pedido valido - Producto invalido - cantidad invalida
 *  
 *
 */
router.post("/editarpedido/:idPedido", estadoPendiente, agregarNuevoProducto);
/**
 * @swagger
 * tags:
 *  name: PEDIDOS
 *  description: Seccion dedicada a "PEDIDOS"
 * 
 * components:
 *  schemas:
 *      mipedido:
 *          type: object
 *          properties:
 *              estado_pedido:
 *                  type: string
 *                  description: Estado actual del pedido
 *              id:
 *                  type: string
 *                  description: Id del pedido
 *              usuario:
 *                  type: object
 *                  description: Datos basicos del usuario que realizo el pedido
 *              orden:
 *                  type: array
 *                  description: Productos, cantidad y precios de las ordenes realizadas
 *              precio_total:
 *                  type: number
 *                  description: Precio todal de la orden
 *              direccion_Pedido:
 *                  type: object
 *                  description: Datos de la direccion del usuario
 *              metodo_pago:
 *                  type: object
 *                  description: Metodo de pago seleccionado
 *          example:
 *              {id: asd123, estado_pedido: "PENDIENTE", usuario: {id: asd123, email: "correoprueba@gmail.com", username: "usuario prueba", telefono: "3999123991"}, orden: [{id: asd123, nombre: "Pollo", precio: 5200, cantidad: 2}], precio_total: 10400, direccion_pedido: {id: asd123, direccion: "calle prueba #13-12"}, metodo_pago: {id: asd123, medio: "Nequi"}}
 *              
 *          
 *      totalpedidos:
 *          type: object
 *          properties:
 *              estado_pedido:
 *                  type: string
 *                  description: Estado actual del pedido
 *              id:
 *                  type: string
 *                  description: Id del pedido
 *              usuario:
 *                  type: object
 *                  description: Datos basicos del usuario que realizo el pedido
 *              orden:
 *                  type: array
 *                  description: Productos, cantidad y precios de las ordenes realizadas
 *              precio_total:
 *                  type: number
 *                  description: Precio todal de la orden
 *              direccion_Pedido:
 *                  type: object
 *                  description: Datos de la direccion del usuario
 *              metodo_pago:
 *                  type: object
 *                  description: Metodo de pago seleccionado
 *          example:
 *              {id: asd123, estado_pedido: "PENDIENTE", usuario: {id: asd123, email: "correoprueba@gmail.com", username: "usuario prueba", telefono: "3999123991"}, orden: [{id: asd123, nombre: "Pollo", precio: 5200, cantidad: 2}], precio_total: 10400, direccion_pedido: {id: asd123, direccion: "calle prueba #13-12"}, metodo_pago: {id: asd123, medio: "Nequi"}}
 *      
 *      realizarpedido:
 *          type: object
 *          required:
 *              - id_producto
 *              - cantidad
 *              - id_direccion
 *              - id_metodo_pago 
 *          properties:
 *              id_producto:
 *                  type: string
 *                  description: Id del producto que se desea ordenar
 *              cantidad:
 *                  type: number
 *                  description: Cantidad del producto que se desea ordenar
 *              id_direcciones:
 *                  type: number
 *                  description: Id de la libreta de direcciones del usuario indicando la direccion del pedido
 *              id_metodo_pago:
 *                  type: string
 *                  description: Id medio de pago disponibles.
 *          example:
 *              id_producto: "asd123"
 *              cantidad: "5"
 *              id_direccion: 999
 *              id_metodo_pago: "asd123"
 *     
 *      editar_estado_admin:
 *          type: object
 *          required:
 *              - estado
 *          properties:
 *              estado:
 *                  type: string
 *                  description: Indicar a que estado quiero que pase el pedido teniendo en cuenta los estados validos - CONFIRMADO, PENDIENTE, EN PREPARACION, ENTREGADO, CERRADO
 *          example:
 *              estado: CONFIRMADO, PENDIENTE, EN PREPARACION, ENTREGADO, CERRADO
 * 
 *      editarCantidadProducto:
 *          type: object
 *          require:
 *              - idproducto
 *              - cantidadproducto
 *          properties:
 *              idproducto:
 *                  type: string
 *                  description: Id del producto al cual se le va a modificar la cantidad en el Pedido
 *              cantidadproducto:
 *                  type: number
 *                  description: Cantidad final deseada
 *          example:
 *                idproducto: asd123
 *                cantidadproducto: "5"
 *      
 *      eliminarProductoDeOrden:
 *          type: object
 *          require:
 *              - idproducto
 *          properties:
 *              idproducto:
 *                  type: string
 *                  description: Id del producto que se desea eliminar
 *          example:
 *              idproducto: asd123
 *      
 *      agregarProductoEnOrden:
 *          type: object
 *          require: 
 *              - idproducto
 *              - cantidadproducto
 *          properties:
 *              idproducto:
 *                  type: string
 *                  description: Id del producto nuevo que queremos agregar a nuestra orden.
 *              cantidadproducto:
 *                  type: string
 *                  description: Cantidad del producto que se desea agregar.
 *          example:
 *              idproducto: "asd123"
 *              cantidadproducto: "2"
 *                      
 */

module.exports = router;