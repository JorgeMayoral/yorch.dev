---
title: 'III - Red social para desarrolladores (MERN)'
date: '2021-03-15'
extract: 'Iniciamos el frontend con Next.js y Chakra UI. Eliminamos los archivos que no vamos a necesitar.'
---

# III - Red social para desarrolladores (MERN)

Creando una red social para desarrolladores con el stack MERN.

## Introducción

Con las funcionalidades básicas de la API preparadas, aunque volveremos en un futuro para hacer cambios y añadir más funciones, podemos pasar a trabajar en el frontend.

Para ello usaremos un framework de React llamado [Next.js](https://nextjs.org), este framework nos facilitará algunas cosas como el enrutado de las páginas de la aplicación; para el estilo de la web usaremos [Chakra UI](https://chakra-ui.com).

El código de la aplicación lo podeis encontrar en el siguiente enlace: [https://github.com/JorgeMayoral/devs-social-app-web](https://github.com/JorgeMayoral/devs-social-app-web). Se aceptan aportaciones.

## Iniciando el proyecto

Iniciaremos el proyecto con Yarn usando una plantilla con chakra ui configurado, haremos unos cuantos cambios a esta plantilla.

```bash
yarn create next-app --example with-chakra-ui web
```

Con este comando ya tendrémos la plantilla con las dependencias instaladas en la carpeta web.

## Haciendo limpieza

Para empezar podemos eliminar el archivo theme.js, ya crearemos nuestro propio tema si lo necesitamos en algún momento.

También podemos eliminar el contenido de la carpeta components, no necesitaremos ninguno de los que vienen creados por defecto.

Podemos eliminar también el archivo _document.js, en cuanto a _app.js y index.js los modificaremos.

El archivo _app.js lo dejaremos así, configurando el proveedor del modo de color para que no se adapte al sistema y que ofrezca como modo inicial de color uno claro, quizá en un futuro añadamos un modo oscuro.

```jsx
import { ChakraProvider } from '@chakra-ui/react';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <ColorModeProvider
        options={{ useSystemColorMode: false, initialColorMode: 'light' }}
      >
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default MyApp;
```

De el archivo index.js eliminaremos casi todo su contenido dejando simplemente lo siguiente:

```jsx
const Index = () => <div>Hello World!</div>;

export default Index;
```

## Ejecutando la app

Ahora que hemos eliminado todo lo que nos sobraba podemos probar a ejecutar nuestra app, para ello ejecutaremos el siguiente comando:

```jsx
yarn dev
```

Si accedemos a [http://localhost:3000](http://localhost:3000) desde el navegador, podremos ver en pantalla el mensaje "Hello World!".

Ya tenemos nuestra app funcionando, en siguientes posts empezaremos a construirla.

Si tienes algún comentario que hacerme puedes contactarme a través de [Twitter](https://twitter.com/Dev_Yorch).

[](https://twitter.com/Dev_Yorch)