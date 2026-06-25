 ¿Qué hace el sistema? 
El sistema es una plataforma Web de gestión de soporte tecnico para consolas de videojuegos.

El sistema funciona con una arquitectura de tres capas: Frontend,
Backend y Base de Datos.

El proceso del sistema es el siguiente:

Captura e Intercepcion: El usuario rellena los campos en el navegador y presiona el boton de  "Registrar Reporte". 
El JavaScript intercepta el evento submit y detiene la recarga nativa de la página usando e.preventDefault().

Validaciones: Antes de mandar cualquier dato, se evalua 5 reglas de validación en tiempo real 
campos requeridos, formato del nombre, longitud exacta del año, filtros de palabras 
prohibidas en el modelo y no puede estar el nombre del cliente en la falla. Si algo falla, se aplican clases CSS 
.invalid para pintar bordes rojos y alertas visuales.

POST: Si los datos son vaidos, JavaScript empaqueta la informacion en un formato JSON y realiza una
 peticion mediante la API Fetch dirigida al endpoint /api/guardar del servidor.

Guardar: El servidor recibe el paquete JSON, lo traduce 
a variables que peude leer y ejecuta una consulta SQL, INSERT INTO para inyectar los datos en la base de datos MySQL.

Mostrar Datos GET: El usuario presiona el boton "Cargar Ultimo Diagnostico". Esto dispara una peticion apuntando al endpoint /api/ultimo.
El servidor recibe la peticion y ejecuta una query en la base de datos ordenando por ID de manera descendente con el limite de un solo registro (SELECT * FROM reporte ORDER BY id DESC LIMIT 1).

Manipulacion del DOM: El servidor devuelve el registro como JSON. En el navegador, JavaScript recibe el objeto 
y realiza una inyeccion en la memoria del navegador usando document.createElement('div'),
 <h3> y <p>, les inyecta los textos recuperados de la base de datos, y los muestra visualmente usando appendChild.