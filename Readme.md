# Fotaza 2 — Comunidad de Fotografía
**Trabajo Práctico Integrador — Programación Web II**  
**Universidad de La Punta — 2026**  
**Autora:** Azul De La Hoz  

---

## Descripción

Fotaza 2 es una aplicación web de comunidad fotográfica que permite a los usuarios publicar, descubrir y valorar fotografías. Está construida con arquitectura MVC sobre Node.js, con renderizado del lado del servidor (SSR) mediante el motor de plantillas Pug.

Los usuarios pueden registrarse, subir publicaciones con múltiples imágenes, comentar, valorar con estrellas, seguir a otros usuarios y buscar contenido. Las imágenes con copyright reciben una marca de agua automática generada con Sharp. Los usuarios no registrados pueden explorar las fotos públicas sin necesidad de crear una cuenta.

---

## Tecnologías utilizadas

| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | v18+ | Entorno de ejecución |
| Express | ^5.2.1 | Framework web |
| Sequelize | ^6.37.8 | ORM para PostgreSQL |
| PostgreSQL | 14+ | Base de datos relacional |
| Pug | ^3.0.4 | Motor de plantillas (SSR) |
| Bootstrap | 5.3.0 | Framework CSS |
| bcrypt | ^6.0.0 | Hasheo de contraseñas |
| Sharp | ^0.34.5 | Procesamiento de imágenes y marca de agua |
| Multer | ^2.1.1 | Subida de archivos |
| express-session | ^1.19.0 | Manejo de sesiones |
| dotenv | ^17.4.2 | Variables de entorno |
| zod | ^4.4.3 | Validación de datos en el servidor |

---

## Requisitos previos

- Node.js v18 o superior
- PostgreSQL corriendo localmente o en la nube
- npm

---

## Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/AzulDevLaHoz/TPI_Fotaza2.git
cd TPI_Fotaza2
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiá el archivo de ejemplo y completá con tus datos:

```bash
cp .env.example .env
```

Editá `.env` con tus credenciales:

```
PORT=3000
DB_HOST=localhost
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=tu_contraseña
SESSION_SECRET=tu_session_secret
```

### 4. Crear la base de datos en PostgreSQL

```sql
CREATE DATABASE fotaza2;
```

### 5. Inicializar las tablas

Crea toda la estructura de tablas desde cero:

```bash
npm run db:init
```

### 6. Cargar usuario de prueba (opcional)

```bash
npm run db:seed
```

### 7. Iniciar el servidor

```bash
npm start
```

La aplicación estará disponible en: **http://localhost:3000**

Para desarrollo con reinicio automático:

```bash
npm run dev
```

---

## Usuarios de prueba

| Email | Contraseña | Rol |
|---|---|---|
| docente@fotaza.com | user123 | usuario |

---

## Funcionalidades implementadas

### Regularización
- Registro e inicio de sesión con encriptación bcrypt
- Publicaciones con título, descripción, etiquetas y múltiples imágenes
- Marca de agua personalizada en imágenes con copyright (Sharp)
- Comentarios por imagen con apertura y cierre por parte del autor
- Valoraciones de 1 a 5 estrellas — una por usuario por imagen, el autor no puede valorar las propias
- Seguimiento entre usuarios (followers/following)
- Motor de búsqueda por título/descripción, etiqueta y usuario

### Adicionales
- Galería pública `/explorar` para usuarios no registrados (solo fotos sin copyright)
- Diseño responsive con sidebar lateral y tema visual personalizado
- Carrusel de imágenes para publicaciones con múltiples fotos
- Modal por imagen con comentarios y valoración sin recargar la página (fetch API)
- Interacción sin recarga: comentarios, valoraciones y toggle de comentarios actualizan el DOM en tiempo real
- Separación de responsabilidades: JS del cliente en `public/js/`, separado de las vistas Pug
- Validación de formularios en el servidor con Zod (`middleware/validates.js`)

---

## Arquitectura del proyecto

El proyecto implementa el patrón **MVC (Model-View-Controller)** con **SSR (Server-Side Rendering)**:

```
TPI_Fotaza2/
├── app.js                    ← Punto de entrada: imports, middlewares, app.use
├── controllers/              ← Lógica de negocio
│   ├── authController.js
│   ├── commentController.js
│   ├── explorarController.js
│   ├── followController.js
│   ├── homeController.js
│   ├── imageController.js    ← Sirve imágenes BLOB + aplica marca de agua
│   ├── postController.js
│   ├── profileController.js
│   ├── ratingController.js
│   └── searchController.js
├── routes/                   ← Mapeo de URLs a controllers
│   ├── auth.js
│   ├── comment.js
│   ├── explorar.js
│   ├── follow.js
│   ├── home.js
│   ├── image.js
│   ├── post.js
│   ├── profile.js
│   ├── rating.js
│   └── search.js
├── models/
│   ├── config/config.js      ← Conexión Sequelize + PostgreSQL
│   ├── model/                ← Definición de tablas
│   └── sync/sync.js          ← Asociaciones entre modelos
├── middleware/
│   ├── auth.js               ← requireLogin, requireValidator
│   └── validates.js          ← Esquemas de validación Zod
├── views/                    ← Plantillas Pug (SSR)
│   ├── layouts/base.pug
│   ├── partials/
│   ├── auth/
│   ├── posts/
│   ├── profile/
│   └── search/
├── public/
│   ├── css/style.css         ← Estilos globales
│   └── js/
│       ├── baseLayout.js     ← Toggle sidebar mobile
│       ├── postCreate.js     ← Toggle campo copyright
│       └── postShow.js       ← Estrellas + comentarios + toggle fetch
├── dbInit.js                 ← npm run db:init
└── seed.js                   ← npm run db:seed
└── .env.example
```

---

## Errores encontrados y soluciones

### 1. `require()` en ES Modules
**Error:** `ReferenceError: require is not defined`  
**Causa:** El proyecto usa `"type": "module"` en `package.json`. El método `require()` pertenece a CommonJS y no existe en ES Modules.  
**Solución:** Reemplazar todos los `require()` por `import` con extensión `.js` explícita.

---

### 2. Imágenes guardadas como BLOB en PostgreSQL
**Problema:** Las imágenes se guardan como datos binarios en la BD. El navegador no puede acceder a ellas con una URL estática.  
**Solución:** Crear la ruta `GET /post/:postId/image/:imageId` en `imageController.js` que busca la imagen, establece `Content-Type: image/jpeg` y envía los bytes con `res.send(image.file)`.

---

### 3. Marca de agua con dimensiones incorrectas
**Problema:** La marca de agua aparecía fuera de los límites de la imagen.  
**Causa:** El SVG se generaba con dimensiones fijas sin considerar el tamaño real de la imagen.  
**Solución:** Usar `sharp(buffer).metadata()` para obtener el ancho y alto reales y calcular el tamaño de fuente en proporción.

---

### 4. Lógica de negocio en app.js
**Problema:** El home y la ruta de imágenes tenían su lógica directamente en `app.js`.  
**Solución:** Extraer a `homeController.js` e `imageController.js` con sus rutas correspondientes.

---

### 5. Comentarios, valoraciones y toggle cerraban el modal al enviarse
**Problema:** Los formularios hacían POST tradicional que recargaba la página y cerraba el modal.  
**Solución:** Interceptar todos los submit con `event.preventDefault()` y usar fetch API. Los controllers devuelven JSON. El JS del cliente actualiza el DOM directamente sin recargar.

---

### 6. Scripts JS no funcionaban al moverlos a `public/js/`
**Problema:** Al separar el JS del cliente en archivos externos, los scripts en el `<head>` se ejecutaban antes de que el DOM y Bootstrap estuvieran disponibles.  
**Solución:** Mover los `<script>` al final del `<body>` en `base.pug` después de Bootstrap, y envolver el código en `document.addEventListener('DOMContentLoaded', () => { ... })`.

---

### 7. Búsqueda de usuarios no devolvía resultados
**Problema:** La búsqueda filtraba posts con INNER JOIN, excluyendo usuarios sin publicaciones.  
**Solución:** Dos consultas independientes: una para posts y otra para usuarios. La vista muestra ambas secciones separadas.

---

### 8. Validación del lado del cliente vs servidor
**Problema:** Los atributos `required` del HTML pueden desactivarse desde el navegador, dejando pasar datos vacíos o inválidos al servidor.  
**Solución:** Implementar validación en el servidor con Zod en `middleware/validates.js`. Los formularios de login, registro, publicación, comentario y valoración se validan antes de procesar cualquier dato.

---

## Notas para el evaluador

- Ejecutar `npm run db:init` antes de `npm start` para crear las tablas
- Ejecutar `npm run db:seed` para cargar el usuario de prueba
- Las imágenes se almacenan como BLOB en PostgreSQL, no en disco
- El proyecto usa ES Modules (`"type": "module"`) — todos los imports incluyen extensión `.js`
- Las variables de entorno necesarias están documentadas en `.env.example`