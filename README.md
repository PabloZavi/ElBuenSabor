# El Buen Sabor

Proyecto final
Tecnicatura Universitaria en Programación
UTN Facultad Regional Mendoza
Materia: Laboratorio de Computación IV

# Resumen
Sistema web de e-commerce de un local de comidas rápidas.
- **Módulo cliente**
  - **Vista general de los productos divididos por categoría y detalle de cada uno sin necesidad de registro o ingreso**
  - **Búsqueda de productos por nombre o categoría**
  - **Registro y acceso al sistema mediante formulario (con sistema de encriptación de contraseña) o cuenta de Google**
  - **Carrito de compras**
  - **Integración con Mercado Pago**
  - **Resumen de cada pedido con los productos pedidos, importes, estado del pedido y tiempo estimado de entrega**
  - **Historial de pedidos con su correspondiente detalle**
  - **Vista de las facturas generadas con cada pedido**
  - **Vista de perfil para cambio de datos personales y contraseña (con sistema de encriptación)**

- **Módulo administración**
  - **Ingreso al sistema mediante formulario**
  - **Página de configuración**
	- **Manejo de cantidad de cocineros**
	- **Alerta de productos bajos de stock y cerca de mínimo de stock (a 20% de llegar al mínimo)**
  - **Página de estadísticas**
	- **Detalle de cantidad de clientes, pedidos, ventas, costos y ganancias**
	- **Ventas, costos y ganancias por día**
	- **Ventas, costos y ganancias por mes**
	- **Cantidad y porcentaje de productos por rubro**
	- **Cantidad y porcentaje de forma de pago preferida por los clientes**
	- **Ranking de productos más vendidos**
	- **Ranking de bebidas más vendidas**
  - **Productos**
	- **Listado de productos con su detalle**
	- **Formulario de nuevo producto**
	- **Formulario de edición de un producto**
  - **Ingredientes**
	- **Listado de ingredientes con su detalle**
	- **Formulario de nuevo ingrediente**
	- **Formulario de edición de un ingrediente**
  - **Rubros**
	- **Listado de rubros con su detalle**
	- **Formulario de nuevo rubro**
	- **Formulario de edición de un rubro**
  - **Pedidos**
	- **Listado de pedidos con filtro de estado para su correspondiente manejo por parte de los diferentes actores del negocio (administración, caja, cocina, delivery) y filtro por id de pedido o nombre de cliente para su rápida ubicación**
	- **Vista del detalle de cada pedido para manejo de pago, cambio de estado del pedido, vista de receta de cada producto y tiempo para entrega**
	- **Vista de facturas generadas**
  - **Usuarios**
	- **Listado de usuarios registrados en el sitio con sus correspondientes datos**
	- **Edición de un usuario para cambio de datos (contraseña excluida) o para darle acceso de administrador**

- **Características implementadas (exceptuando las ya detalladas en módulo cliente y módulo administración)**
  - **Inhabilitación de compras en los horarios en los que el local está cerrado (aunque igual se pueden ver los productos). Se verifica el día y el horario mediante datos globales y no por datos de la máquina local para evitar conflictos**
  - **Verificación de stock de ingredientes para preparar cada producto para habilitar o no la compra de cada producto (si no llega a haber stock suficiente para preparar un producto, se lo muestra igual en pantalla pero con el aviso 'sin stock' y deshabilitada la compra)**
  - **Cálculo aproximado de entrega de un pedido según los productos pedidos, cantidad de pedidos pendientes en cocina, si se envía o no y cantidad de cocineros**
  - **Cálculo automático y en tiempo real del costo de un producto a partir de los ingredientes que se van agregando y sus respectivas cantidades para hacer un cálculo fácil y accesible del precio de venta del mismo**
  - **Lógica de manejo de estados para habilitar/deshabilitar opciones de cambio de estado según el estado actual del pedido (por ejemplo un pedido 'A confirmar' no puede cambiarse al estado 'Entregado' sin antes haber pasado por los otros estados)**
  - **Descuento de ingredientes del stock según los productos pedidos al confirmar un pedido**
  - **Al elegir como forma de pago la plataforma Mercado Pago, se deshabilitó la opción de pagos que no sean automáticos/en el momento (por ejemplo no se permite emitir un ticket de pago para pagar mediante Rapipago o Pago Fácil)**
  - **Deshabilitado el mostrar categorías que no tengan productos en página principal del cliente para evitar la muestra o búsqueda en contenido vacío**
  - **Subida automática de imágenes de productos al servicio Cloudinary en la nube para evitar problemas a la hora de enlazar una imagen**
  - **Middlewares para evitar accesos no permitidos según el rol de cada usuario y para evitar accesos cuando faltan datos (por ejemplo confirmar un pedido cuando todavía no se eligió la forma de pago, la forma de envío, etc.**