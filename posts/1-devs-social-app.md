---
title: 'I - Red social para desarrolladores (MERN)'
date: '2020-03-10'
extract: 'Empezamos el proyecto de la red social para desarrolladores instalando las dependencias del servidor y creando los archivos y carpetas que necesitaremos.'
---

# I - Red social para desarrolladores (MERN)

Creando una red social para desarrolladores con el stack MERN.

## Introducción

Con el objetivo de seguir aprendiendo y poder añadir proyectos a mi portfolio personal decidí crear una red social para desarrolladores, muy similar a Twitter, pero con el objetivo de que sea fácil compartir fragmentos de código.

Para ello usaré el stack MERN ([MongoDB](https://www.mongodb.com/), [Express](https://expressjs.com), [React](https://reactjs.org/) y [Node](https://nodejs.dev/)), puesto que es con el que me encuentro más cómodo.

En este post y los siguientes iré comentando el proceso. Los posts no seguirán un orden concreto, puesto que se basarán en los avances que vaya haciendo en la aplicación. Tampoco entraré en detalles sobre el uso de [Git](https://git-scm.com/) y [Github](https://github.com/), pero puede que si veamos un poco de [Postman](https://www.postman.com/) o alguna otra herramienta.

Todo el código podrá ser encontrado en mi cuenta de [Github](https://github.com/JorgeMayoral).

## Iniciando el backend

El primer paso es iniciar el proyecto, como gestor de paquetes usaré [Yarn](https://yarnpkg.com/).

```bash
yarn init
```

Una vez inicializado el proyecto instalaremos las dependencias que necesitaremos para esta primera parte:

```bash
yarn add bcryptjs cookie-session cors dotenv express express-async-handler /
 helmet mongoose morgan

yarn add -D nodemon
```

- [bcryptjs](https://www.npmjs.com/package/bcryptjs) - Con bcrypt podremos hashear las contraseñas de los usuarios para poder almacenarlas en la base de datos de forma segura, así como compararla por la introducida al iniciar sesión.
- [cookie-session](https://www.npmjs.com/package/cookie-session) - Esta dependencia nos permitirá almacenar información de la sesión en el cliente en una cookie a la que podremos acceder desde el servidor.
- [cors](https://www.npmjs.com/package/cors) - Middleware necesario para habilitar [CORS](https://developer.mozilla.org/es/docs/Web/HTTP/CORS).
- [dotenv](https://www.npmjs.com/package/dotenv) - Nos permitirá cargar las variables de entorno desde un archivo .env
- [express](https://www.npmjs.com/package/express) - Framework web que usaremos para construir la API.
- [express-async-handler](https://www.npmjs.com/package/express-async-handler) - Con este middleware podremos manejar facilmente los errores que puedan ocurrir dentro de nuestras funciones asíncronas.
- [helmet](https://www.npmjs.com/package/helmet) - Este middleware nos ayudará con la seguridad de la API al establecer algunas cabeceras HTTP.
- [mongoose](https://www.npmjs.com/package/mongoose) - Mongoose nos facilitará trabajar con la base de datos (MongoDB) al permitirnos elaborar modelos.
- [morgan](https://www.npmjs.com/package/morgan) - Middleware que nos dará un logging de las peticiones hechas a nuestra API.
- [nodemon](https://www.npmjs.com/package/nodemon) - Nos permitirá relanzar automáticamente la API tras hacer cambios al código durante el desarrollo.

Una vez instaladas las dependencias añadiremos dos scripts a nuestro archivo package.json:

```json
"scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
```

El script "start" lo usaremos para ejecutar el servidor cuando estemos en producción, y el script "dev" lo utilizaremos durante el desarrollo para que se vuelva a ejecutar automáticamente el servidor tras los cambios.

A continuación crearemos la siguiente estructura de carpetas dentro del directorio de nuestro servidor

```bash
server
└── src
    ├── config
    │   └── db.js
    ├── controllers
    │   ├── post.controller.js
    │   └── user.controller.js
    ├── middleware
    │   └── error.middleware.js
    ├── models
    │   ├── Post.model.js
    │   └── User.model.js
    ├── routes
    │   ├── post.routes.js
    │   └── user.routes.js
    └── server.js
```

El archivo principal de nuestra aplicación será server.js

Veremos el contenido de cada archivo en futuras entradas, también añadiremos nuevos archivos y carpetas según avance la aplicación.

Si tienes algún comentario que hacerme puedes contactarme a través de [Twitter](https://twitter.com/Dev_Yorch).