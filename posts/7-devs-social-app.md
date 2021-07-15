---
title: 'VII - Red social para desarrolladores (MERN)'
date: '2020-07-15'
extract: 'Añadimos test unitarios, separamos controlador y servicio, y cambiamos la autentificación a JWT.'
---

# VII - Red social para desarrolladores (MERN)

Creando una red social para desarrolladores con el stack MERN.

## Introducción

La app progresa poco a poco, he terminado por ahora con la parte del usuario, lo próximo será ponerme con la parte de los posts. Podéis ver los cambios en la rama de desarrollo del repositorio de [Github](https://github.com/JorgeMayoral/devs-social-app-server/tree/development) si en el momento en el que leáis este post aún no han sido integrados en la rama principal.

# Backend

Esta vez he trabajado únicamente en el backend, concretamente en la parte relacionada con los usuarios. Para el frontend aún estoy decidiendo si hacer una web o una app con [React Native](https://reactnative.dev/) y [Expo](https://expo.io/).

### Testing

Una de las cosas más importantes que quería hacer era implementar tests para asegurarme de que todas las funcionalidades de la app funcionan correctamente, para ello he usado [Jest](https://jestjs.io/es-ES/). Anteriormente ya había implementado algún test, pero estos eran para la aplicación completa, desde que llega la petición al usuario hasta que se recibe la respuesta, decidí cambiarlos por test unitarios, los test de integración y e2e los implementaré más adelante.

Los test no son perfectos y me habré dejado casos sin probar, pero estoy probando y los iré mejorando poco a poco. Aquí tenéis un pequeño ejemplo:

```jsx
test('registration return error with existing user data', async () => {
    const { username, name, email, password } = initialUsers[0];
    const data = await registration(username, name, email, password);

    expect(data).toHaveProperty('error');
  });
```

### Servicios y Controladores

Anteriormente en el controlador se encontraba tanto el procesamiento de la petición y el envío de la respuesta junto con la lógica de la aplicación, he decidido separar está ultima en sus propias funciones en un archivo de servicios, de esta forma me es mucho más fácil testear las funciones y el controlador simplemente se encarga de procesar la petición, llamar al servicio proporcionándole los datos necesarios y enviar la respuesta de vuelta al cliente. El controlador también se encarga de generar el token cuando es necesario, de esto hablaré más adelante.

Un pequeño ejemplo del controlador y el servicio para el registro de un usuario:

```jsx
// user.controller.js
/**
 * @name Register
 * @description Register a new user
 * @access Public
 * @route POST /api/v1/user
 */
const register = asyncHandler(async (req, res) => {
  const { username, name, email, password } = req.body;

  if (!username || !name || !email || !password) {
    res.status(400);
    throw new Error('User data missing');
  }

  const response = await registration(username, name, email, password);

  if (response.error) {
    res.status(401);

    throw new Error(response.error);
  } else {
    const token = generateToken(response.id);

    response.token = token;

    res.status(201);
    res.json(response);
  }
});
```

```jsx
// user.service.js
const registration = asyncHandler(async (username, name, email, password) => {
  const emailExists = await User.findOne({ email });
  const usernameExists = await User.findOne({ username });

  if (emailExists || usernameExists) {
    return { error: 'User already exists' };
  }

  const user = await User.create({
    username,
    name,
    email,
    password,
  });

  const data = {
    id: user._id,
    username: user.username,
    name: user.name,
    email: user.email,
    posts: user.posts,
    likes: user.likes,
    followers: user.followers,
    following: user.following,
  };

  return data;
});
```

### Autentificación

En el anterior post hable acerca de cambiar el método de autentificación a [Json Web Token](https://jwt.io/) y eso he hecho.

Para ello, he añadido dos funciones, una para generar un token al que se le añade el id del usuario que ha iniciado sesión (o se ha registrado) con una validez de un año, y otra para validar un token recibido.

También he añadido un middleware para proteger las rutas que requieren que el usuario que esté autentificado, si es así añade los datos del usuario a la petición para poder acceder a estos en el controlador y el servicio, y si no está autentificado devuelve un error 401.

El middleware es este:

```jsx
// auth.middleware.js
const asyncHandler = require('express-async-handler');

const { User } = require('./../models/User.model');
const { validateToken } = require('./../utils/jwt');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = validateToken(token);

      req.user = await User.findById(decoded.id).select(['-password']);

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized - Token failed.');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized - No token');
  }
});

module.exports = { protect };
```

Al aplicar este middleware a una ruta (por ejemplo la encargada de actualizar un usuario) queda así:

```jsx
// user.routes.js
router.route('/update').put(protect, updateUser);
```

---

Esto es todo por hoy, si tienes algún comentario que hacerme puedes contactarme a través de [Twitter](https://twitter.com/Dev_Yorch) o en el formulario de contacto de mi web. Y recuerda, las aportaciones al proyecto son bienvenidas.

[](https://twitter.com/Dev_Yorch)

[DevYorch](https://yorch.dev)

[JorgeMayoral - Overview](https://github.com/JorgeMayoral)