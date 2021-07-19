---
title: 'VIII - Red social para desarrolladores (MERN)'
date: '2021-07-15'
extract: 'Completamos la gestión de los posts. Separamos controlador y servicio, añadimos tests y protegemos rutas con el middleware de autentificación.'
---

# VIII - Red social para desarrolladores (MERN)

Creando una red social para desarrolladores con el stack MERN.

## Introducción

En el post de hoy terminamos de refactorizar la parte relativa a la publicación de posts y escribimos algunos tests. Podéis ver los cambios en el repositorio de [Github](https://github.com/JorgeMayoral/devs-social-app-server).

# Backend

### Testing

Al igual que en la parte relacionada con el usuario, en la parte de los posts también tenemos algunos tests unitarios para asegurarnos que todo funciona correctamente. No hay mucho que comentar sobre ellos, no son muy distintos a los del usuario, queda pendiente mejorarlos y añadir más, además de hacer tests e2e.

Aquí un pequeño ejemplo:

```jsx
test('can be updated with a new body', async () => {
    const postToUpdate = await Post.findOne({});
    const newBody = 'Update Post Test 1';
    const updatedPost = await update(
      postToUpdate._id,
      newBody,
      postToUpdate.authorId,
    );

    expect(updatedPost).not.toHaveProperty('error', 'Unauthorized');
    expect(updatedPost.body).toBe(newBody);
    expect(updatedPost.body).not.toBe(postToUpdate.body);
  });
```

### Servicios y Controladores

Tampoco hay mucho que comentar en cuanto a los servicios y controladores de los post, funcionan de una manera muy similar a los del usuario, pero hay que tener en cuenta es que ha habido que llamar en algunas ocasiones al modelo del usuario, para añadir o eliminar el id de los posts al crearse o borrarse, y al dar like a un post. No creo que la forma con la que he resuelto este problema sea la mejor, es un punto que en futuras actualizaciones habrá que mejorar.

Un pequeño ejemplo del controlador y el servicio para cuando un usuario da like a un post:

```jsx
// post.controller.js
/**
 * @name Like Post
 * @description Give a like to a post / Remove it if it's already liked
 * @access Private
 * @route PUT /api/v1/post/:id/like
 */
const likePost = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.id;

  if (!userId) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  if (!postId) {
    res.status(400);
    throw new Error('Post ID missing');
  }

  const post = await like(userId, postId);

  res.status(202);
  res.json(post);
});
```

```jsx
// post.service.js
const like = asyncHandler(async (userId, postId) => {
  let post = await Post.findById(postId);

  if (!post) {
    return { error: 'Post not found' };
  }

  const user = await User.findById(userId);

  if (!user) {
    return { error: 'User not found' };
  }

  if (post.likes.includes(userId) || user.likedPosts.includes(postId)) {
    // Unlike if the user already likes the post
    post.likes = post.likes.filter((l) => !l.equals(user._id));
    user.likedPosts = user.likedPosts.filter((l) => !l.equals(post._id));
  } else {
    // Like if the user do not like the post
    post.likes.push(user._id);
    user.likedPosts.push(post._id);
  }

  post.totalLikes = post.likes.length;

  await post.save();
  await user.save();

  post = post.renameId();

  return post;
});
```

### Autentificación

En cuanto a la autentificación del usuario se han protegido algunas rutas de los posts para que solo un usuario autentificado pueda utilizarlas, en el servicio se comprueba si el usuario loggeado es el autor del post en los casos en los que se pretende actualizar o eliminar un post.

Aquí un ejemplo de como quedan las rutas protegidas:

```jsx
router
  .route('/:id')
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);
```

---

En próximos post empezaremos a ver el despliegue del backend en un servidor, implementaremos un sistema de CI/CD con Github Actions, y veremos un poco de Docker.

---

Esto es todo por hoy, si tienes algún comentario que hacerme puedes contactarme a través de [Twitter](https://twitter.com/Dev_Yorch) o en el formulario de contacto de mi web. Y recuerda, las aportaciones al proyecto son bienvenidas.

[](https://twitter.com/Dev_Yorch)

[DevYorch](https://yorch.dev)

[JorgeMayoral - Overview](https://github.com/JorgeMayoral)