# Manual de Usuario de LaborApp



**Manual de Usuario de LaborApp: Plataforma para la Gestion de Servicios de Trabajadores Independientes**

Nombre del estudiante: `[Completar]`  
Programa academico: `[Completar]`  
Institucion: `[Completar]`  
Curso: `[Completar]`  
Docente: `[Completar]`  
Fecha de entrega: `30 de abril de 2026`

Nota de formato APA 7 para entrega final en Word/PDF:
- Fuente recomendada: Times New Roman 12, Arial 11 o Calibri 11.
- Interlineado doble en todo el documento.
- Margenes de 2.54 cm.
- Numero de pagina en esquina superior derecha.
- Sangria de primera linea de 1.27 cm en parrafos.

## Resumen
Este manual de usuario presenta las instrucciones operativas para utilizar LaborApp, una aplicacion web orientada a la conexion entre clientes y trabajadores independientes. El documento describe el proceso de acceso, registro, autenticacion, busqueda de servicios, publicacion de ofertas y administracion de servicios por parte de usuarios con rol trabajador. Tambien se incluyen recomendaciones de seguridad digital y una guia de solucion de problemas frecuentes para reducir fricciones en el uso de la plataforma. El enfoque metodologico del manual sigue principios de claridad, consistencia y minimizacion del error del usuario, en linea con buenas practicas de calidad de producto digital y seguridad en aplicaciones web (ISO, 2023; OWASP Foundation, n.d.). El objetivo es asegurar que el usuario final pueda completar sus tareas principales sin apoyo tecnico continuo, favoreciendo la adopcion de la plataforma en contextos academicos y de prototipado funcional.

**Palabras clave:** manual de usuario, plataforma web, autenticacion, usabilidad, trabajadores independientes.

## 1. Introduccion
LaborApp es una plataforma web desarrollada para facilitar la relacion entre personas que requieren servicios y trabajadores independientes que desean ofrecerlos. El sistema implementa autenticacion, control de roles y operaciones de gestion de servicios. Este manual esta orientado a usuarios finales y describe el uso funcional del sistema en escenarios reales de interaccion.

## 2. Objetivo y alcance del manual
El objetivo de este manual es guiar al usuario final en la ejecucion de tareas operativas dentro de LaborApp.

El alcance incluye:
- Acceso a la plataforma.
- Registro e inicio de sesion.
- Consulta de servicios con filtros y paginacion.
- Publicacion, edicion y eliminacion de servicios para trabajadores.
- Cierre de sesion y manejo de errores comunes.

No incluye configuracion de servidor, despliegue o mantenimiento tecnico.

## 3. Requisitos para el uso
Para utilizar la plataforma se recomienda:
- Navegador actualizado (Chrome, Edge, Firefox o Safari).
- Conexion estable a internet.
- Acceso a la URL del frontend.

En entorno local de desarrollo:
- Frontend: `http://localhost:5173`
- Backend/API: `http://localhost:8080`

## 4. Procedimiento de uso

## 4.1 Acceso inicial
1. Abrir el navegador.
2. Ingresar la URL de LaborApp.
3. Verificar que cargue la pagina principal con listado de servicios.

## 4.2 Registro de cuenta
1. Seleccionar `Crear cuenta` en la barra superior.
2. Completar nombre, correo, contrasena y tipo de usuario.
3. Si el tipo es `trabajador`, completar adicionalmente celular, categoria y oficio.
4. Seleccionar `Crear mi cuenta`.
5. Confirmar mensaje de registro exitoso y redireccion al login.

## 4.3 Inicio de sesion
1. Seleccionar `Ingresar`.
2. Completar correo y contrasena.
3. Presionar `Entrar a LaborApp`.
4. Validar ingreso al sistema y visualizacion del nombre de usuario en barra superior.

Nota: la sesion usa cookie segura en navegador, lo cual disminuye exposicion del token frente a ataques de tipo XSS (OWASP Foundation, n.d.).

## 4.4 Busqueda y filtrado de servicios
Desde la pagina principal:
1. Escribir texto en buscador (oficio, titulo o categoria).
2. Filtrar por categoria.
3. Definir precio minimo y maximo.
4. Seleccionar orden (`mas recientes`, `precio ascendente`, `precio descendente`, `titulo A-Z`).
5. Cambiar de pagina con botones `Anterior` y `Siguiente`.

## 4.5 Contacto con trabajadores
1. En una tarjeta de servicio, seleccionar `Contactar`.
2. Revisar correo y celular disponibles.
3. Usar el medio de contacto preferido.

## 4.6 Publicacion de servicio (rol trabajador)
1. Iniciar sesion con rol `trabajador`.
2. Seleccionar `Publicar`.
3. Completar formulario con titulo, descripcion, precio, categoria, oficio y datos de contacto.
4. Seleccionar `Publicar ahora`.
5. Verificar redireccion al modulo `Mis servicios`.

## 4.7 Gestion de publicaciones propias
En `Mis servicios`:
1. Seleccionar `Editar` para modificar un servicio.
2. Seleccionar `Eliminar` para borrar un servicio.
3. Confirmar la accion cuando el sistema lo solicite.

## 4.8 Cierre de sesion
1. Seleccionar `Salir` en barra superior.
2. Confirmar retorno a estado no autenticado.

## 5. Mensajes de error frecuentes
`Credenciales incorrectas.`
- Validar correo y contrasena.

`No fue posible cargar los servicios en este momento.`
- Verificar conexion de red o disponibilidad del backend.

`Acceso denegado. Token no enviado.`
- Reingresar al sistema, ya que la sesion puede haber expirado.

`No autorizado para editar/eliminar este servicio.`
- Solo el propietario de la publicacion tiene permisos de modificacion.

## 6. Recomendaciones de seguridad para el usuario
- Utilizar contrasenas robustas y no reutilizadas.
- Cerrar sesion al usar equipos compartidos.
- No compartir credenciales por canales inseguros.
- Mantener navegador actualizado.

Estas practicas se alinean con recomendaciones de seguridad para aplicaciones web modernas (Express.js, n.d.; OWASP Foundation, n.d.).

## 7. Conclusiones
El manual de usuario establece un flujo operativo claro para que clientes y trabajadores puedan utilizar LaborApp con autonomia. La estandarizacion de pasos, mensajes y recomendaciones permite mejorar experiencia de uso, reducir errores y fortalecer la seguridad funcional de la plataforma en contextos academicos y de evolucion hacia entornos productivos.

## Referencias (APA 7)
American Psychological Association. (2020). *Publication manual of the American Psychological Association* (7th ed.). https://doi.org/10.1037/0000165-000

Express.js. (n.d.). *Security best practices for Express in production*. Recuperado el 30 de abril de 2026, de https://expressjs.com/en/advanced/best-practice-security.html

ISO. (2023). *ISO/IEC 25010:2023 systems and software engineering—Systems and software quality requirements and evaluation (SQuaRE)—Product quality model*. https://www.iso.org/standard/78176.html

Mozilla Developer Network. (n.d.). *Cross-Origin Resource Sharing (CORS)*. Recuperado el 30 de abril de 2026, de https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS

OWASP Foundation. (n.d.). *Cross site scripting prevention cheat sheet*. Recuperado el 30 de abril de 2026, de https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
