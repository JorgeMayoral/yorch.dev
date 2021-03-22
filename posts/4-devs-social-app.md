---
title: 'IV - Red social para desarrolladores (MERN)'
date: '2020-03-17'
extract: 'Creamos algunos componentes para el layout de la aplicación, las páginas de registro e inicio de sesión, y las conectamos con el servidor'
---

# IV - Red social para desarrolladores (MERN)

Creando una red social para desarrolladores con el stack MERN.

## Introducción

Vamos a empezar a trabajar en el frontend, haremos varios componentes que usaremos en las distintas páginas de la aplicación, prepararemos las páginas de registro e inicio de sesión y las conectaremos con el backend de nuestra app.

Puesto que el diseño no es mi especialidad no me detendré a explicar las clases de Chakra UI que utilizo en los componentes, modificad lo que consideréis libremente.

El código de la aplicación lo podeis encontrar en el siguiente enlace: [https://github.com/JorgeMayoral/devs-social-app-web](https://github.com/JorgeMayoral/devs-social-app-web). Si se os ocurre algún cambio que podría ser interesante podéis hacer una pull request.

## Iniciando la app

Antes de comenzar es recomendable que inicies la app para poder ver los cambios que vayamos haciendo, para ello ejecutad el comando

```bash
yarn dev
```

Ahora si váis a [http://localhost:3000](http://localhost:3000) en el navegador podréis ir viendo los cambios al guardar.

## Navbar

Vamos a empezar creando un componente Navbar.js en la carpeta components, el contenido será el siguiente:

```jsx
import { Button } from '@chakra-ui/button';
import { Box, Center, Flex, Heading, Link } from '@chakra-ui/layout';
import NextLink from 'next/link';

const Navbar = () => {
  return (
    <Flex zIndex={1} position="sticky" top={0} bgColor="#fff" p={4}>
      <Flex flex={1} m="auto" align="center">
        <NextLink href="/">
          <Link _hover={{ textDecoration: 'none' }}>
            <Center>
              <Heading size="lg" color="#00adb5">
                Devs
              </Heading>
              <Heading size="lg">Social</Heading>
            </Center>
          </Link>
        </NextLink>

        <Box ml="auto">
          <NextLink href="/login">
            <Link>
              <Button
                bgColor="#00adb5"
                color="white"
                size="md"
                borderWidth={2}
                _hover={{
                  bgColor: 'white',
                  color: '#00adb5',
                  borderColor: '#00adb5',
                  borderWidth: 2,
                }}
              >
                Login
              </Button>
            </Link>
          </NextLink>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Navbar;
```

Como véis usaremos los componentes propios de Chakra UI en vez de html, estos nos permiten pasar como props las diferentes propiedades CSS que queramos.

Importaremos el componente link de Next.js como NextLink, este nos permitirá crear enlaces a diferentes páginas de nuestra aplicación, como podéis ver envolvemos con el el nombre de la app para poder ir a la página inicial al hacer click, y el botón para poder ir a la página de login al pulsar.

## Footer

Este componente es opcional, podéis crear un archivo Footer.js en components, yo lo he usado para añadir un enlace a la página de contacto de mi web. Al ser un enlace a una página externa he usado en componente Link de Chakra UI y no el de Nex.js.

```jsx
import { Center, Link, Text } from '@chakra-ui/layout';

const Footer = () => {
  return (
    <Center bgColor="#fff" p={4}>
      <Link href="https://yorch.dev/contacto" isExternal>
        <Text>Contact</Text>
      </Link>
    </Center>
  );
};

export default Footer;
```

## Layout

A continuación creamos este componente como Layout.js, lo usaremos para envolver el contenido de las distintas páginas para que todas tengan la navbar y el footer.

```jsx
import { Box, Grid } from '@chakra-ui/layout';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <Grid h="100vh" templateRows="auto 1fr auto">
      <Navbar />
      <Box bgColor="#eeeeee" mx="auto" maxWidth="2xl">
        {children}
      </Box>
      <Footer />
    </Grid>
  );
};

export default Layout;
```

Recuperamos children de las props, será el contenido del layout.

La página inicial de la app quedaría así con el layout:

![Index Layout](/postImages/4-index-layout.png)

## Preparaciones para las páginas

Antes de crear las páginas que veremos hoy vamos a necesitar varias cosas.

Lo primerio instalar [Formik](https://formik.org/) como dependecia. Formik es una librería que nos permite hacer formularios en React de una manera muy sencilla, además se integra muy bien con Chakra UI. Instalamos la dependencia co

```bash
yarn add formik
```

A continuación vamos a crear un archivo .env.local, nos permitirá usar variables de entorno en Next.js, en esta variable tendremos la URL del servidor, es mejor tenerla así que en el código para poder cambiarla facilmente. En este archivo escribiremos lo siguiente.

```jsx
NEXT_PUBLIC_API_URL='http://localhost:5000/api/v1'
```

Las variables de entorno en Next.js solo son accesibles en el servidor, pero puesto que la petición se debe hacer desde el cliente está tendrá que ser pública, para ello añadimos "NEXT_PUBLIC_" al inicio del nombre de la variable, de esta forma podrémos acceder a ella en la app con 

```jsx
process.env.NEXT_PUBLIC_API_URL
```

Recordad que debemos tener ejecutandose el servidor para poder hacer peticiones, para ello podéis usar

```jsx
yarn start
```

en el directorio del servidor.

## Componente Input

Vamos a crear un componente que usaremos en nuestros formularios, para ello añadiremos esto al archivo InputField.js de components.

```jsx
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { useField } from 'formik';

const InputField = ({ label, ...props }) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name} mb={0} mt={4}>
        {label}
      </FormLabel>
      <Input {...field} {...props} id={field.name} bgColor="#fefefe" />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default InputField;
```

Usaremos los componentes para formularios de Chakra UI, para que estos funcionen correctamente con Formi deberemos hacer uso del hook useField(), de este hook recuperaremos field y error, field nos permitirá interactuar con Formik para almacenar el valor de los inputs, por ejemplo. Con error podremos mostrar errores al usuario fácilmente.

## Página de Login

Ahora que tenemos preparado el componente del input podémos empezar con las páginas, para ello vamos a crear 2 archivos en el directorio pages, login.js y register.js.

Una de las ventajas de Next.js es la facilidad con la que podemos crear páginas sin necesidad de tener componentes a nivel de aplicación que nos permitan el enrutado, con solo tener el archivo en la carpeta pages ya podremos acceder a esa nueva página en http://localhost:3000/login.

El contenido de la página de login es este

```jsx
import { Button } from '@chakra-ui/button';
import { Box, Heading, Link, Text } from '@chakra-ui/layout';
import { Form, Formik } from 'formik';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import InputField from '../components/InputField';
import Layout from '../components/Layout';

const Login = () => {
  const router = useRouter();

  function validate(values) {
    const errors = {};

    if (!values.username) {
      errors.username = 'Username is required.';
    }

    if (!values.password) {
      errors.password = 'Password is required.';
    }

    return errors;
  }

  async function loginUser(values) {
    const userData = {
      username: values.username,
      password: values.password,
    };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        },
      );
      const data = await response.json();
      console.log(data);
      router.push('/');
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Layout>
      <Box bgColor="#fff" p={4} mt={10} borderRadius="lg">
        <Heading>Sign in</Heading>
        <Formik
          onSubmit={async (values, actions) => {
            actions.setSubmitting(true);
            await loginUser(values);
            actions.setSubmitting(false);
          }}
          validate={validate}
          initialValues={{
            username: '',
            password: '',
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField name="username" label="Username" />
              <InputField name="password" label="Password" type="password" />
              <Button
                type="submit"
                mt={4}
                bgColor="#00adb5"
                color="white"
                size="md"
                borderWidth={2}
                isLoading={isSubmitting}
                _hover={{
                  bgColor: 'white',
                  color: '#00adb5',
                  borderColor: '#00adb5',
                  borderWidth: 2,
                }}
              >
                Login
              </Button>
            </Form>
          )}
        </Formik>
        <Text mt={4}>
          Don't have an account?{' '}
          <NextLink href="/register">
            <Link color="#00adb5">Sign up</Link>
          </NextLink>
          .
        </Text>
      </Box>
    </Layout>
  );
};

export default Login;
```

Creamos un componente de React llamado Login, dentro vamos a necesitar varias cosas.

Lo primero necesitamos un router, para ello usaremos el hook useRouter() de Next.js, este router nos permitirá redirigir al usuario a la página inicial tras iniciar sesión.

Tabién crearemos una función validate que nos permitirá mostrar un error al usuario si los campos del formulario están vacíos.

A continuación necesitamos una función asíncrona que usaremos para enviar la información de login al servidor, si es correcta nos devolverá los datos del usuario, los mostrará en la pantalla y nos devolverá a la pantalla de inicio con (router.push('/')), si no lo es, mostrará un error en la consola, en un futuro mejoraremos el manejo de los errores.

![Login Response](/postImages/4-login-response.png)

Para hacer la petición usamos fetch, también podríamos utilizar una librería como axios que nos facilitaría algunas cosas como la cabecera del tipo de contenido. No me voy a detener a explicar el funcionamiento de fetch ahora, aunque podría ser buena idea hacer un post sobre su uso.

Finalmente devolvemos el contenido del componente, necesitaremos envolver el formulario con el componente Formik en el que declaramos los valores que estamos usando y las acciones a realizar al hacer submit del mismo, tenemos el formulario dentro de una función anónima que recive como parametro isSubmitting, esto forma parte de Formik y nos permitirá, al pasarle esta variable al botón, un spinner mientras se envían los datos al servidor, indicando al usuario que la app está cargando.

La página quedaría así:

![Login Page](/postImages/4-login-page.png)

También tenemos al final del formulario un enlace a la página de registro  que crearemos a continuación.

## Página de registro

Al tener en la carpeta pages el archivo register.js podremos acceder a esta página en http://localhost:3000/register.

Está página es muy similar a la de inicio de sesión, pero con más campos en el formulario.

```jsx
import { Button } from '@chakra-ui/button';
import { Box, Heading, Link, Text } from '@chakra-ui/layout';
import { Form, Formik } from 'formik';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import InputField from '../components/InputField';
import Layout from '../components/Layout';

const Register = () => {
  const router = useRouter();

  function validate(values) {
    const errors = {};

    if (!values.username) {
      errors.username = 'Username is required.';
    }

    if (!values.name) {
      errors.name = 'Name is required.';
    }

    if (!values.email) {
      errors.email = 'Email is required.';
    }

    if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }

    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords must be the same.';
    }

    return errors;
  }

  async function registerUser(values) {
    const userData = {
      username: values.username,
      name: values.name,
      email: values.email,
      password: values.password,
    };
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      console.log(data);
      router.push('/');
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Layout>
      <Box bgColor="#fff" p={4} mt={10} borderRadius="lg">
        <Heading>Create an account</Heading>
        <Formik
          onSubmit={async (values, actions) => {
            actions.setSubmitting(true);
            await registerUser(values);
            actions.setSubmitting(false);
          }}
          validate={validate}
          initialValues={{
            username: '',
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField name="username" label="Username" />
              <InputField name="name" label="Name" />
              <InputField name="email" label="Email" type="email" />
              <InputField name="password" label="Password" type="password" />
              <InputField
                name="confirmPassword"
                label="Confirm password"
                type="password"
              />
              <Button
                type="submit"
                mt={4}
                bgColor="#00adb5"
                color="white"
                size="md"
                borderWidth={2}
                isLoading={isSubmitting}
                _hover={{
                  bgColor: 'white',
                  color: '#00adb5',
                  borderColor: '#00adb5',
                  borderWidth: 2,
                }}
              >
                Register
              </Button>
            </Form>
          )}
        </Formik>
        <Text mt={4}>
          Already have an account?{' '}
          <NextLink href="/login">
            <Link color="#00adb5">Login</Link>
          </NextLink>
          .
        </Text>
      </Box>
    </Layout>
  );
};

export default Register;
```

Las principales diferencias son que la función de validación comprueba, a parte de que los campos no estén vacíos, que la contraseña tiene al menos 6 caracteres y que los campos de contraseña y confirmar contraseña tienen el mismo contenido. También hacemos la petición al servidor usando la ruta que creamos para el registro.

Está página quedaría así:

![Register Page](/postImages/4-register-page.png)

## Probando al app

Ahora que tenemos las páginas de registro e inicio de sesión podremos probar a crear nuevos usuarios y ver si podemos iniciar sesión con ellos, para ello recordad que tenéis que tener el servidor ejecutandose.

En próximos posts veremos como un usuario puede crear mensajes, tendremos la página de home, la página del usuario y veremos como podemos seguir a otros usuarios.

Se que paso muy por encima de algunas cosas, pero esta serie de posts no pretende ser un tutorial en profundidad, si tenéis alguna duda u os encontráis algun problema no dudés en preguntarme y trataré de resolverla.

Si tienes algún comentario que hacerme puedes contactarme a través de [Twitter](https://twitter.com/Dev_Yorch) o en el formulario de contacto de mi web.

[@Dev_Yorch](https://twitter.com/Dev_Yorch)

[DevYorch](https://yorch.dev)