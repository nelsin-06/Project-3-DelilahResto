# SRPINT-PROJETS-3 - AWS Y MONGO ATLAS

Nos proponemos a realizar una API/REST para un restaurante en las cuales necesitamos cubrir rutas de usuarios (Registro, login y modificaciones), productos (CRUD), pedidos (CRUD y validaciones) y métodos de pago (CRUD).

La API esta instalada en los servicios de AWS y posee una conexion a atlas(MongoDB) para manejo de datos.
# PROYECTO 🌎

A continuación se darán las principales características y configuraciones para el funcionamiento correcto, automático y siempre disponible presente en la API y los servidores AWS.

Recordar que estamos realizando una API no tenemos front en ningunas de las rutas, la única ruta con elementos visuales disponibles es "https://delilahapiweb.store/swagger". La cual nos dirige al ambiente visual de swagger para la respectiva ejecución de pruebas.

### Tecnologias

- INSTANCES EC2
- CENTOS 7
- NGINX
- NVM(Node y modulos de la API)
- PM2
- LOAD BALANCERS(EC2)
- AUTO SCALING GROUP(EC2)
- BUCKET S3
- CRONTAB
- ROUTE 53
- ELASTICACHE(REDIS)
- CLOUDFRONT
- ATLAS(MongoDB)
- CERBOT 

### Construcción

 1. La API esta montada sobre instancias de EC2 en sistema operativo CentOS 7 de LINUX.
 2. La API corre a través del servidor web NGINX el cual tiene instalado el certificado SSL correspondiente para el dominio "delilahapiweb.store" lo que nos asegura que todas las solicitudes sean a través de una conexión segura por HTTPS.
 3. Políticas de seguridad revísadas rigurosamente las cuales solo tiene los permisos necesarios para su funcionamiento correcto, limitando asi la posibilidad de intrusos y errores en los servidores.
 4. Dominio adquirido: "delilahapiweb.store" desde hostinger.co.
 5. Certificado SSL para el dominio.
 6. Balanceador de cargas de AWS.
 7. Cada una de las instancias tiene el módulo "PM2" para el monitoreo e inicio automático de la API y su rutina de test.
 8. Se realizó la conexión entre la API en EC2 y el servicio externo "Atlas" de MongoDB para el manejo de datos.
 9. El servicio S3 de AWS tiene 2 buckets. Uno de ellos es el encargado de la integración continua. ya que está interconectado a este repositorio para que cada actualización aquí subida se refleje en nuestra instancia y otro bucket el cual contiene una página estática con el diagrama de la composición de la infraestructura de nuestra API.
 10. Grupo de autoescalado el cual tiene como indicación lanzar máximo 5 instancias según las condiciones de uso.
 11. Capa de caché en Elasticache con redis de AWS.
 12. Cloudfront interconectado con el bucket de S3 el cual nos entrega el diagrama de la infraestructura de nuestra API y AWS.

### Especificaciones. ✔️

#### PM2

Administrador de procesos en ejecución. en la instancia tiene 2 procesos, 1 es vigilar el funcionamiento, disponibilidad e integridad de la API, el otro se encarga de ejecutar la rutina de test para validar que toda la API funcione correctamente.

#### Instances EC2

Instancias montadas en sistema operativo LINUX con CentOS 7.

#### LoadBalancer EC2

El balanceador de cargas está configurado para que haga un check health cada 60 a la ruta https://delilahapiweb.store/health-check.

#### AutoScaling Group EC2

El grupo de autoescalado está configurado para lanzar una nueva instancia cuando el uso de la CPU de alguna de las instancias supere el 60%. Como máximo 5 instancias y como mínimo se debe tener 1.

#### Route 53

Manejo de los DNS en conjunto con el dominio adquirido y el redireccionamiento de peticiones a los respectivos servicios.

#### S3 BUCKET CI/CD

Hay configurado un bucket en el servicio de s3 el cual está encargado de la integración continua con nuestro repositorio y lo que se desplegá en la instancia de EC2. Esto se hace interconectando el bucket de s3 y el repositorio de gitlab. En la instancia se está ejecutando un script cada minuto el cual se encarga de sincronizar lo que está alojado en el bucket y así mantener las instancias actualizadas a la última versión del repositorio.

#### Crontab

Como se mencionó anteriormente para la integración continua del repositorio y la API se utiliza un script el cual esta alojado en la carpeta "script" del directorio principal del usuario. El script envía una petición al bucket de s3 y sincroniza los cambios del bucket con los ficheros locales. Si existen cambios se ejecuta el comando para reiniciar el servicio de PM2 para aplicar los cambios.

#### S3 BUCKET CLOUDFRONT

Hay un bucket configurado con el servicio de CloudFront para ofrecernos una página estática con la imagen de la organización de la infraestructura que compone la API.

#### Elasticache - REDIS

La API cuenta con una capa de cache con redis. Servicio que también esta alojado en los servidores de AWS. La capa de cache solo aplica para las rutas relacionadas a los productos.

## Datos pre-creados para pruebas 🗂️

Para que la prueba se haga más práctica se creó una rutina de creación de un usuario con permisos de administrador, un producto general y un método de pago general con los que se pueden realizar las pruebas. Los datos de los documentos generados por default son los siguientes:

### usuarios

 "isAdmin" : true
 
 "direccion" : [{"direccion" : "direccion 1 #1-2", id: 999}]
 
 "estado" : true,
 
 "email" : "correo1@gmail.com"
 
 "username" : "correo uno dos"
 
 "password" : "passwordsecreto"
 
 "telefono" : 3991234568

El usuario anterior se crea por default cuando hay una conexion exitosa con la base de datos.
El usuario tambien es valido para iniciar sesion.
### productos

"nombre" : "carne asada"

"precio" : 10000

El producto anterior se crea por default cuando hay una conexion exitosa con la base de datos.
El producto es valido para agregar al pedido.

### metodos de pago

"medio" : "nequi"

El metodo de pago anterior crea por default cuando hay una conexion exitosa con la base de datos.
El metodo de pago es valido para agregar al pedido.

## Instrucciones 📚

Para que la experiencia sea más agradable y entender correctamente la API se debe tener en cuenta:

1. El usuario no podrá realizar un nuevo pedido mientras tenga un pedido activo(Todos los pedidos del usuario deben estar en estado "CERRADO").
2. El usuario no podrá modificar opciones de su pedido después de que este a pasado a un estado diferente de  "PENDIENTE". Si el pedido pasa a estado "CONFIRMADO" u otro no sera efectiva ninguna modificación.
3. Para que la función de caché de nuestra API sea más perceptible, en el primer llamado a nuestra lista de productos hay un tiempo de respuesta de 3 segundos si este no se ha almacenado en caché.
4. La caché de la lista de productos tiene un tiempo de expiración de 1 minuto.
5. La caché se limpia seguidamente de cada modificación en las rutas de productos(Solo se limpia, pero no se actualiza).
6. Los únicos estados de pedidos admitidos son: PENDIENTE, CONFIRMADO, EN PREPARACIÓN, ENTREGADO y CERRADO. El estado del pedido se debe ingresar en mayúscula.
7. Los usuarios tienen un "ESTADO". El cual nos indica si la cuenta esta activa(True) o se encuentra suspendida(False).
8. Todos los datos que se ingresen en cada una de las rutas tiene validaciones como de sintaxis o si el campo está vacío.
9. Algunos datos no pueden estar duplicados por lo que también existen validaciones para esto.
10. Al iniciar sesion se respondera con un "Token", el cual utilizaremos para iniciar sesion en swagger.(Se debe copiar el contenido del token sin comillas u otros string que no sea exclusivamente el del token en la casilla de autenticacion del swagger).
11. Podemos iniciar sesion con las siguientes credenciales: email : correo1@gmail.com - password : passwordsecreto

## Ejecucion de pruebas ⚙️

Para realizar las pruebas se utiliza el ambiente gráfico SWAGGER, se puede acceder desde el siguiente [LINK](https://delilahapiweb.store/swagger) o ingresando a su navegador de preferencia y yendo a la ruta "https://delilahapiweb.store/swagger"

## Ejecucion de test 🧪

Este test está dirigido a las posibles respuestas positivas o negativas que podría recibir la ruta de "REGISTRO DE USUARIOS". 
Podemos ejecutar el test accediendo a la consola de la instancia y ejecutando el comando:

    pm2 restart API-TEST

Con esto haremos que la rutina de test se inicie y podremos verificar el exito del test accediendo al log de pm2.

    pm2 log API-TEST

 El test está implementado con mocha y chai.

## API construida con🛠️
- dotenv
- express
- jsonwebtoken
- express-JWT
- swagger-jsdoc
- swagger-ui-express
- Mongoose
- bcrypt
- mongo
- helmet
- Mocha y chai

## Contruido por 👨‍💻👨‍🍳

**Nelson Stiven Gallego Garcia**
**nelsoncg0611@gmail.com**

**https://www.linkedin.com/in/nelson-gallego-tec-dev**
