---
title: 'II - Red social para desarrolladores (MERN)'
date: '2020-03-12'
extract: 'Programamos las funciones básicas del backend que necesitaremos la app. Conectamos la API a la base de datos y añadimos los controladores y las rutas.'
---

# II - Red social para desarrolladores (MERN)

Creando una red social para desarrolladores con el stack MERN.

## Introducción

Hoy avanzaremos en el servidor iniciado en la anterior entrada.

Crearemos los modelos para los usuarios y los posts que usaremos en la base de datos, las rutas como contraladores para interactuar con esta, añadiremos el middleware que instalamos anteriormente y crearemos nuestro propio middleware para manejar los posibles errores.

## Creando el servidor

Lo primero será crear nuestro servidor en server.js

Para ello importaremos primero las dependencias que instalamos

```jsx
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const cookieSession = require('cookie-session');
```

A continuación creamos un archivo .env en la raíz de la carpeta del servidor con el siguiente contenido

```jsx
NODE_ENV='development'
PORT=5000
MONGO_URI='mongodb://localhost:27017/devs-social-app'
COOKIES_SECRET_KEY='CookiesSecretKeyDevelopment'
```

En NODE_ENV pondremos 'development', lo cambiaremos a 'production' al desplegar el servidor a producción, en PORT el puerto en el que quereis que escuche vuestra API (evitad poner el puerto 3000 puesto que es en el que escucha React por defecto), en MONGO_URI la dirección de vuestra base de datos de MongoDB y en COOKIES_SECRET_KEY la clave secreta de la cookie.

A continuación configuraremos estas variables de entorno con dotenv y crearemos la app con express.

```jsx
dotenv.config();

const app = express();
```

Agregamos el middleware que instalamos a la app

```jsx
app.use(express.json());
app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(
  cookieSession({
    name: 'session',
    keys: [COOKIES_SECRET_KEY],
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    cookie: {
      secure: true,
      httpOnly: true,
    },
  }),
);
```

express.json() nos permite parsear los datos JSON del body de las peticiones.

Ahora añadimos una ruta para poder probar la API y ponemos la app a escuchar en el puerto especificado.

```jsx
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server listening in ${NODE_ENV} mode on port ${PORT}...`);
});
```

Finalmente ejecutaremos el servidor en modo desarrollo con

```bash
yarn dev
```

Ahora si accedemos desde el navegador a [http://localhost:5000](http://localhost:5000) veremos 'Hello World!'.

Nuestro servidor ya funciona, ahora le añadiremos funcionalidades.

## Configurando la base de datos

Vamos a crear una función para conectar el servidor a nuestra base de datos de MongoDB, para ello añadimos lo siguiente a src/config/db.js

```jsx
const mongoose = require('mongoose');

const connectDB = async (mongoUri) => {
  try {
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

A continuación importamos esta función en src/server.js y la ejecutamos, pasandole la dirección de nuestra base de datos, para establecer la conexión con ella.

```jsx
// Database Configuration Import
const connectDB = require('./config/db');

// Database Connection
connectDB(MONGO_URI);
```

## Modelos de MongoDB con mongoose

Ahora que tenemos una conexión con la base de datos podemos crear los modelos que usaremos para los usuarios y los posts.

Empezaremos con el modelo del usuario, para ello añadiremos e

### Modelo del usuario

Empezaremos con el modelo del usuario, para ello añadiremos lo siguiente a src/models/User.model.js

Primero importamos las dependencias y definimos el esquema del usuario con los distintos campos que tendrá, el tipo de dato, si es requerido y el valor por defecto, con "timestamps: true" indicamos a mongodb que añada un campo con la fecha de creación del usuario y otro con la fecha en la que se actualice.

```jsx
const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: 'Username is required',
    },
    name: {
      type: String,
      required: 'Name is required',
    },
    email: {
      type: String,
      required: 'Email is required',
    },
    password: {
      type: String,
      required: 'Password is required',
    },
    posts: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    likes: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    followers: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    following: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
  },
  { timestamps: true },
);
```

Posteriormente añadimos un metodo al esquema, este nos permitirá comprobar si la contraseña introducida por el usuario al hacer login se corresponde con la contraseña hasheada almacenada en la base de datos.

```jsx
userSchema.methods.matchPassword = async function (plaintText) {
  return await bcrypt.compare(plaintText, this.password);
};
```

Después indicamos a mongo que antes de guardar el usuario queremos que bcrypt haga un hash de la contraseña del usuario, esto ocurrirá tanto al crear un usuario nuevo como al modificar uno existente si este ha cambiado su contraseña.

```jsx
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
```

Para finalizar, creamos el modelo del usuario y lo exportamos.

```jsx
const User = model('User', userSchema);

module.exports = { User };
```

### Modelo del post

El modelo para el post es mas sencillo que el modelo del usuario:

```jsx
const { Schema, model } = require('mongoose');

const postSchema = new Schema(
  {
    body: {
      type: String,
      required: 'Body is required',
    },
    authorId: {
      type: Schema.Types.ObjectId,
      required: 'Author is required',
    },
    authorName: {
      type: String,
      required: 'Author name is required',
    },
    authorUsername: {
      type: String,
      required: 'Author username is required',
    },
    likes: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    totalLikes: {
      type: Number,
      default: 0,
    },
    isComment: {
      type: Boolean,
      default: false,
    },
    comments: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
  },
  { timestamps: true },
);

const Post = model('Post', postSchema);

module.exports = { Post };
```

Como nota, el tipo de dato que aparece como [Schema.Types.ObjectId] es un array de un tipo especial que usa Mongodb para las IDs.

## Controladores

Con los modelos listos podemos pasar a los controladores, serán los encargados de realizar las distintas operaciones cuando se haga una petición a alguna de las rutas de la API.

### Controlador del usuario

Comenzaremos con el controlador del usuario en src/controllers/user.controller.js. Lo primero será importar las dependencias, necesitaremos express-async-handler, para capturar los posibles errores, el modelo del usuario y el modelo del post.

```jsx
const asyncHandler = require('express-async-handler');

const { User } = require('./../models/User.model');
const { Post } = require('./../models/Post.model');
```

A continuación crearemos nuestro primer controlador, este se encargará de registrar un nuevo usario cuando se reciba una petición POST a la ruta /api/v1/user. El controlador recibirá los parametros necesarios para crear al usuario en el cuerpo de la petición, buscará si existe un usuario con el mismo nombre de usuario o email, si no existe, creará uno nuevo en la base de datos.

```jsx
/**
 * @name Register
 * @description Register a new user
 * @access Public
 * @route POST /api/v1/user
 */
const register = asyncHandler(async (req, res) => {
  const { username, name, email, password } = req.body;

  const emailExists = await User.findOne({ email });
  const usernameExists = await User.findOne({ username });

  if (emailExists || usernameExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    username,
    name,
    email,
    password,
  });

  if (user) {
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.name = user.name;
    res.status(201).json({
      id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      posts: user.posts,
      likes: user.likes,
      followers: user.followers,
      following: user.following,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});
```

El siguiente controlador es el encargado de hacer login. Comprueba si existe un usuario con el nombre de usuario introducido, si es así, comprueba si coincide la contraseña introducida con el método que añadimos al modelo del usuario, si coincide, añadimos distintos datos a la cookie de la sesión para poder acceder a ellos más adelante, y devolvemos al cliente los datos de usuario.

```jsx
/**
 * @name Login
 * @description Login user
 * @access Public
 * @route POST /api/v1/user/login
 */
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.name = user.name;
    res.status(200).json({
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      posts: user.posts,
      likes: user.likes,
      followers: user.followers,
      following: user.following,
    });
  } else {
    res.status(401);
    throw new Error('Invalid username or password');
  }
});
```

También añadiremos controladores tanto como para obtener todos los usuarios como para obtener uno de ellos en base al ID proporcionado como parametro en la ruta. Al hacer la busqueda no seleccionaremos ni el email ni la contraseña.

```jsx
/**
 * @name Get Users
 * @description Get all users without email and password
 * @access Public
 * @route GET /api/v1/user/all
 */
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select(['-email', '-password']);
  res.status(200).json(users);
});

/**
 * @name Get User by Id
 * @description Get user by Id without email and password
 * @access Public
 * @route GET /api/v1/user/:id
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select([
    '-email',
    '-password',
  ]);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('ERROR: User not found');
  }
});
```

Con el siguiente controlador podremos hacer que los usuarios se puedan seguir y dejar de seguir, para ello tendremos que comprobar que el usuario ha iniciado sersión y que el usuario al que se quiere seguir existe. Si se cumplen estas condiciones, comprobaremos si el usuario ya sigue a su objetivo, si es así dejara de seguirlo, en caso contrario lo seguirá, para ello añadiremos el ID del otro a los campos followers o following según corresponda.

```jsx
/**
 * @name Follow User
 * @description Follow a user / Unfollow if it is already followed
 * @access Private
 * @route PUT /api/v1/user/:id/follow
 */
const followUser = asyncHandler(async (req, res) => {
  const userId = req.session.userId;
  const targetId = req.params.id;

  if (!userId) {
    res.status(401);
    throw new Error('ERROR: Unauthorized');
  }

  const targetUser = await User.findById(targetId);

  if (!targetUser) {
    res.status(404);
    throw new Error('ERROR: User not found');
  }

  const user = await User.findById(userId);

  if (
    targetUser.followers.includes(userId) ||
    user.following.includes(targetId)
  ) {
    targetUser.followers = targetUser.followers.filter((f) => f != userId);
    user.following = user.following.filter((f) => f != targetId);
  } else {
    targetUser.followers = [userId, ...targetUser.followers];
    user.following = [targetId, ...user.following];
  }

  await targetUser.save();
  await user.save();

  res.status(202).json(targetUser);
});
```

Necesitaremos un controlador para que el usuario pueda modificar sus datos. Para ello tendremos que comprobar varias cosas: que el usuario autentificado es el mismo que el usuario que se quiere modificar, que si el nombre de usuario o email quiere ser modificado no exista ya en la base de datos y que el usuario a modificar existe. Hecho esto, modificamos los campos en el usuario y lo guardamos. Gracias a la opción que añadimos al modelo del usuario, la contraseña se guardará como un hash y no como texto plano.

```jsx
/**
 * @name Update User
 * @description Update logged User
 * @access Private
 * @route PUT /api/v1/user/:id
 */
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findById(req.params.id);
  const { username, name, email, password } = req.body;

  if (!user) {
    res.status(404);
    throw new Error('ERROR: User not found');
  }

  const emailExists = await User.findOne({ email });
  const usernameExists = await User.findOne({ username });

  if (
    (user.username !== username && usernameExists) ||
    (user.email !== email && emailExists)
  ) {
    res.status(400);
    throw new Error('ERROR: Username or email already taken');
  }

  if (!userId || user._id != userId) {
    res.status(401);
    throw new Error('ERROR: Unauthorized');
  } else {
    user.username = user.username !== username ? username : user.username;
    user.name = user.name !== name ? name : user.name;
    user.email = user.email !== email ? email : user.email;
    user.password = user.password !== password ? password : user.password;
  }

  user.save();
  res.status(200).json({
    id: user._id,
    username: user.username,
    name: user.name,
    email: user.email,
    posts: user.posts,
    likes: user.likes,
    followers: user.followers,
    following: user.following,
  });
});
```

En el caso de que el usuario quiere eliminar su cuenta deberemos asegurarnos de que existe, que se corresponde con el usuario autentificado y podremos eliminarlo junto con los posts cuyas IDs tenemos guardadas con el usuario.

```jsx
/**
 * @name Delete User
 * @description Delete logged user
 * @access Private
 * @route DELETE /api/v1/user/:id
 */
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('ERROR: User not found');
  }

  if (!userId || user._id != userId) {
    res.status(401);
    throw new Error('ERROR: Unauthorized');
  } else {
    const userPosts = user.posts;
    await user.remove();
    for (let post of userPosts) {
      await Post.findByIdAndDelete(post._id);
    }
    res.status(200).json({ message: 'User deleted' });
  }
});
```

Finalmente exportaremos los controladores para poder utilizarlos en las rutas.

```jsx
module.exports = {
  register,
  login,
  getUsers,
  getUserById,
  followUser,
  updateUser,
  deleteUser,
};
```

### Controlador del post

Los controladores del post los tenemos en src/controllers/post.controller.js. Son muy similares a los del usuario, en este caso necesitaremos el modelo del usuario a parte de el modelo del post.

Primero tenemos el controlador que crea el post, similar al de registrar un  usuario, con la diferencia de que en este no añadimos una cookie, lo que hacemos es leer si está existe pues el usuario debe estar autentificado para poder crear un post.

```jsx
const asyncHandler = require('express-async-handler');

const { Post } = require('./../models/Post.model');
const { User } = require('./../models/User.model');

/**
 * @name Create Post
 * @description Create a post
 * @access Private
 * @route POST /api/v1/post
 */
const createPost = asyncHandler(async (req, res) => {
  const { userId, username, name } = req.session;

  if (!userId) {
    res.status(401);
    throw new Error('ERROR: Unauthorized');
  }

  const newPost = {
    body: req.body.body,
    authorId: userId,
    authorUsername: username,
    authorName: name,
  };

  const post = await Post.create(newPost);

  if (post) {
    const user = await User.findById(post.authorId);
    user.posts = [post._id, ...user.posts];
    await user.save();
    res.status(201).json(post);
  }
});
```

Los controladores para obtener todos los posts o un post según su ID no tienen ninguna novedad respecto a los del usuario.

```jsx
/**
 * @name Get Posts
 * @description Get all posts
 * @access Public
 * @route GET /api/v1/post/all
 */
const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({});
  res.status(200).json(posts);
});

/**
 * @name Get Post by Id
 * @description Get a Post by Id
 * @access Public
 * @route GET /api/v1/post/:id
 */
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404);
    throw new Error('ERROR: Post not found');
  }
});
```

El controlador encargado de gestionar los likes sigue una lógica muy similar al controlador del follow, la diferencia es que aquí no tenemos dos usuarios, tenemos al usuario que da el like, y el post que lo recibe. También calculamos antes de guardar las modificaciones el número total de likes que tiene el post.

```jsx
/**
 * @name Like Post
 * @description Give a like to a post / Remove it if it's already liked
 * @access Private
 * @route PUT /api/v1/post/:id/like
 */
const likePost = asyncHandler(async (req, res) => {
  const userId = req.session.userId;
  const postId = req.params.id;

  const user = await User.findById(userId);
  const post = await Post.findById(postId);

  if (!user) {
    res.status(401);
    throw new Error('ERROR: Unauthorized');
  }

  if (!post) {
    res.status(404);
    throw new Error('ERROR: Post not found');
  }

  if (post.likes.includes(userId) || user.likes.includes(postId)) {
    post.likes = post.likes.filter((l) => l != userId);
    user.likes = user.likes.filter((l) => l != postId);
  } else {
    post.likes = [user._id, ...post.likes];
    user.likes = [post._id, ...user.likes];
  }

  post.totalLikes = post.likes.length;

  await post.save();
  await user.save();

  res.status(202).json(post);
});
```

Para proceder a actualizar el post simplemente deberemos comprobar que el autor del mismo es el usuario autentificado.

```jsx
/**
 * @name Update Post
 * @description Update logged user post
 * @access Private
 * @route PUT /api/v1/post/:id
 */
const updatePost = asyncHandler(async (req, res) => {
  const userId = req.session.userId;
  const post = await Post.findById(req.params.id);
  const { body } = req.body;

  if (!post) {
    res.status(404);
    throw new Error('ERROR: Post not found');
  }

  if (!userId || post.authorId != userId) {
    res.status(401);
    throw new Error('ERROR: Unauthorized');
  } else {
    post.body = post.body !== body ? body : post.body;
  }

  post.save();
  res.status(200).json({ post });
});
```

De igual manera, al eliminar un post deberemos comprobar que el usuario que envía la petición es el autor del post, si es así podremos eliminar el post y quitarlo de la lista de posts del usuario.

```jsx
/**
 * @name Delete Post
 * @description Delete logged user post
 * @access Private
 * @route DELETE /api/v1/post/:id
 */
const deletePost = asyncHandler(async (req, res) => {
  const userId = req.session.userId;
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('ERROR: Post not found');
  }

  if (!userId || post.authorId != userId) {
    res.status(401);
    throw new Error('ERROR: Unauthorized');
  } else {
    const user = await User.findById(post.authorId);
    user.posts = user.posts.filter((p) => p != post._id);
    user.save();
    post.delete();
    res.status(200).json({ message: 'Post deleted' });
  }
});
```

Finalmente exportamos las funciones.

```jsx
module.exports = {
  createPost,
  getPosts,
  getPostById,
  likePost,
  updatePost,
  deletePost,
};
```

## Rutas

Las rutas no requieren mucha explicación, importamos los controladores y el objeto Router de express, añadimos la ruta que deseemos y pasamos por parametro al método de la petición el controlador que queramos, finalmente exportamos el router para usarlo en el servidor.

### Rutas del usuario

```jsx
const { Router } = require('express');

// Controllers
const {
  register,
  login,
  getUsers,
  getUserById,
  followUser,
  updateUser,
  deleteUser,
} = require('./../controllers/user.controller');

const router = Router();

// Routes
router.route('/login').post(login);
router.route('/all').get(getUsers);
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);
router.route('/:id/follow').put(followUser);
router.route('/').post(register);

module.exports = router;
```

### Rutas del post

```jsx
const { Router } = require('express');

// Controllers
const {
  createPost,
  getPosts,
  getPostById,
  likePost,
  updatePost,
  deletePost,
} = require('./../controllers/post.controller');

const router = Router();

// Routes
router.route('/all').get(getPosts);
router.route('/:id').get(getPostById).put(updatePost).delete(deletePost);
router.route('/:id/like').put(likePost);
router.route('/').post(createPost);

module.exports = router;
```

## Middleware

Crearemos dos funciones que nos servirán de middleware para gestionar los errores en src/middleware/error.middleware.js.

La primera se ejecutará en caso de que la petición recibida no coincida con ninguna de nuestras rutas

```jsx
const notFound = (req, res, next) => {
  const error = new Error(`ERROR: Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
```

También tendremos otra que devolverá un error cuando se capture alguno en los controladores, y añadirá un código adecuado a la respuesta.

```jsx
const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : null,
  });
};

module.exports = { notFound, errorHandler };
```

Exportaremos las funciones para poder usarlas en el servidor.

Finalmente añadimos las rutas de usuario y de post al archivo server.js junto con el middleware que acabados de crear, el archivo deberá quedar así:

```jsx
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const cookieSession = require('cookie-session');

// Database configuration import
const connectDB = require('./config/db');

// Custom Middleware Imports
const { notFound, errorHandler } = require('./middleware/error.middleware');

// Route Imports
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');

dotenv.config();

const app = express();

//Environment Variables
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const MONGO_URI = process.env.MONGO_URI;
const COOKIES_SECRET_KEY = process.env.COOKIES_SECRET_KEY;

// Database connection
connectDB(MONGO_URI);

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(
  cookieSession({
    name: 'session',
    keys: [COOKIES_SECRET_KEY],
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    cookie: {
      secure: true,
      httpOnly: true,
    },
  }),
);

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/post', postRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Error Handlers
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening in ${NODE_ENV} mode on port ${PORT}...`);
});
```

Recordad que podéis ver el [código](https://github.com/JorgeMayoral/devs-social-app-server) en mi cuenta de [Github](https://github.com/JorgeMayoral).

Si tienes algún comentario que hacerme puedes contactarme a través de [Twitter](https://twitter.com/Dev_Yorch).

[](https://twitter.com/Dev_Yorch)