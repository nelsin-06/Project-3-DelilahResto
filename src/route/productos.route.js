const router = require('express').Router();
const esAdmin = require('../middlewares/esAdmin');
const cache = require('../middlewares/cache.productos');
const { 
    listaProductos, 
    editarProducto, 
    eliminarProducto,
    agregarProducto} = require('../controllers/productos.controller');

/**
 * @swagger
 * /productos/listaproductos:
 *  get:
 *      summary: Obtener todos los productos disponibles.
 *      tags: [PRODUCTOS]
 *      schema:
 *      responses:
 *          200:
 *              description: Lista de productos.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/obtenerproductos'
 */
router.get("/listaproductos", cache, listaProductos);

/**
 * @swagger
 * /productos/edicionproductos/{IdDeProducto}:
 *  put:
 *      summary: Edita el nombre y/o el precio de un producto ya creado.
 *      description: Edita el nombre y/o el precio de un producto ya creado por medio de su Id.
 *      tags: [PRODUCTOS]
 *      parameters:
 *        - in: path
 *          name: IdDeProducto
 *          required: true
 *          schema:
 *              type: string
 *              example: asd123
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/editproduct'
 *      responses:
 *          201:
 *              description: Actualizacion de producto exitosa.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: "Producto actualizado Nombre: Pollo, Precio: 5200"          
 *          400:
 *              description: Posibles errores lanzados por la API por incidencias en la sintaxis y/o requisitos necesarios para realizar la solicitud.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Id de producto invalido - Precio invalido - Nombre de producto invalido
 */
router.put("/edicionproductos/:id", esAdmin, editarProducto);

/**
 * @swagger
 * /productos/eliminarproductos/{IdDeProducto}:
 *  delete:
 *      summary: Eliminar un producto del sistema.
 *      description: eliminar un producto por medio de su id.
 *      tags: [PRODUCTOS]
 *      parameters:
 *        - in: path
 *          name: IdDeProducto
 *          required: true
 *          schema:
 *              type: string
 *              example: asd123
 *      responses:
 *          201:
 *              description: Eliminacion de producto exitosa.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Se elimino satisfactoriamente el producto CocaCola con el precio de 3200
 *          400:
 *              description: Posibles errores lanzados por la API por incidencias en la sintaxis y/o requisitos necesarios para realizar la solicitud.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Id de producto invalido - El id invalido del producto a eliminar es invalido.
 */
router.delete("/eliminarproductos/:id", esAdmin, eliminarProducto);

/**
 * @swagger
 * /productos/agregarproductos:
 *  post:
 *      summary: Ingresar un nuevo producto al sistema
 *      description: Ingresar un producto nuevo al sistema indicando su nombre y su precio.
 *      tags: [PRODUCTOS]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/agregarproductos'
 *      responses:
 *          201:
 *              description: El producto Sandwitch de pollo apanado fue creado exitosamente
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Producto creado exitosamente
 *          400:
 *              description: Posibles errores lanzados por la API por incidencias en la sintaxis y/o requisitos necesarios para realizar la solicitud. 
 *              content:
 *                  json:
 *                      schema:
 *                          type: string
 *                          example: El producto ya se encuentra registrado - Nombre de produco invalido - precio de producto invalido.
 *          
 */
router.post("/agregarproductos", esAdmin, agregarProducto);

/**
 * @swagger
 * tags:
 *  name: PRODUCTOS
 *  description: Seccion dedicada a "PRODUCTOS"
 * 
 * components:
 *  schemas:
 *      obtenerproductos:
 *          type: object
 *          properties:
 *              nombre:
 *                  type: string
 *                  description: Nombre del producto.
 *              id:
 *                  type: string
 *                  description: Id unico del productos.
 *              precio:
 *                  type: number
 *                  description: Precio del producto.
 *          example:
 *              nombre: CocaCola
 *              id: "asd123"
 *              precio: 2200
 * 
 *      agregarproductos:
 *          type: object
 *          required:
 *              - nombre
 *              - precio
 *          properties:
 *              nombre:
 *                  type: string
 *                  description: Nombre del producto a crear.
 *              precio:
 *                  type: number
 *                  description: Precio del producto a crear.
 *          example:
 *              nombre: Sandwitch de pollo apanado
 *              precio: 5500
 * 
 *      editproduct:
 *          type: object
 *          required:
 *              - nombre
 *              - precio
 *          properties:
 *              nombre:
 *                  type: string
 *                  description: Nombre del producto a actualizar.
 *              precio:
 *                  type: number
 *                  description: Precio en pesos del producto actualizar.
 *          example:
 *              nombre: Pollo
 *              precio: 5300
 */
module.exports = router;