---
title: 'V - Red social para desarrolladores (MERN)'
date: '2021-03-23'
extract: 'Añadimos contexto global a la aplicación para almacenar la información del usuario y poder acceder desde otras partes de la app'
---

# V - Red social para desarrolladores (MERN)

Creando una red social para desarrolladores con el stack MERN.

## Introducción

En el post de hoy vamos a añadir un contexto global a nuestra aplicación para guardar los datos del usuario autentificado y poder recuperarlos en otras partes de la app, crearemos un custom hook y moveremos la lógica de inicio de sesión y registro a su propio servicio.

## Moviendo los servicios

Lo primero será mover la lógica que hay en los componentes para llevar a cabo el inicio de sesión y el registro de usuarios a su propio servicio, para ello crearemos una carpeta llamada services en src y dos archivos, login.js y register.js

El contenido de estos archivos serán las funciones que tenemos en los componentes.

login.js:

```jsx
export default async function login({ username, password }) {
  const userData = { username, password };

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
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}
```

register.js:

```jsx
export default async function register(userData) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}
```

Añadiremos estas funciones a los componentes cuando creemos el hook.

## Creando el contexto

Para crear el contexto crearemos un archivo UserContext.js en src/context, el contenido es el siguiente:

```jsx
import { createContext, useEffect, useState } from 'react';

const Context = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState();

  useEffect(() => {
    if (!user) {
      const userData = JSON.parse(localStorage.getItem('devs-userData'));

      if (userData) {
        setUser(userData);
      }
    }
  }, [user]);

  return (
    <Context.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
```

Por una parte creamos el contexto usando la función createContext de react, por otro lado crearemos el proveedor del contexto con la función UserContextProvider, esta función almacenará un usuario en el estado, y tendrá un efecto con el que recuperará los datos si están almacenados en el localStorage, el proveedor permitirá acceder a user y a la función setUser.

A continuación necesitaremos envolver toda la aplicación con el provider para poder acceder al usuario en otras partes de la app.

Para ello modificamos _app.js y la dejamos así:

```jsx
import { Box, ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import { UserContextProvider } from '../context/UserContext';

function MyApp({ Component, pageProps }) {
  return (
    <UserContextProvider>
      <ChakraProvider>
        <ColorModeProvider
          options={{ useSystemColorMode: false, initialColorMode: 'light' }}
        >
          <Box bgColor="#eeeeee">
            <Component {...pageProps} />
          </Box>
        </ColorModeProvider>
      </ChakraProvider>
    </UserContextProvider>
  );
}

export default MyApp;
```

## Custom hook

Para consumir la información contenida en el contexto que hemos creado y hacer uso de los servicios vamos a crear un hook, para ellos creamos useUser.js en src/hooks con el siguiente código:

```jsx
import { useCallback, useContext, useState } from 'react';
import Context from '../context/UserContext';
import loginService from '../services/login';
import registerService from '../services/register';

export function useUser() {
  const { user, setUser } = useContext(Context);
  const [state, setState] = useState({ loading: false, error: false });

  const register = useCallback(
    (userData) => {
      setState({ loading: true, error: false });
      registerService(userData)
        .then((userInfo) => {
          localStorage.setItem('devs-userData', JSON.stringify(userInfo));
          setState({ loading: false, error: false });
          setUser(userInfo);
        })
        .catch((error) => {
          setState({ loading: false, error: true });
          console.error(error);
        });
    },
    [setUser],
  );

  const login = useCallback(
    ({ username, password }) => {
      setState({ loading: true, error: false });
      loginService({ username, password })
        .then((userData) => {
          localStorage.setItem('devs-userData', JSON.stringify(userData));
          setState({ loading: false, error: false });
          setUser(userData);
        })
        .catch((error) => {
          setState({ loading: false, error: true });
          console.error(error);
        });
    },
    [setUser],
  );

  const logout = useCallback(() => {
    localStorage.removeItem('devs-userData');
    setUser(null);
  }, [setUser]);

  return {
    user,
    register,
    login,
    logout,
    isLoading: state.loading,
    hasError: state.error,
  };
}
```

Este hook obtendrá user y setUser del contexto haciendo uso del hook useContext al que le pasamos el contexto del usuario, también tendremos un estado que nos indicará si está cargando o hemos recibido un error, también tendremos tres funciones que harán uso del hook useCallback, la función register usará el servicio creado anteriormente, si no hay error guardaremos la información en localStorage y en el estado del contexto con setUser. Haremos lo mismo con la función login. En la función logout eliminaremos esta información del localStorage y estableceremos el usuario a null.

Ahora podemos extraer del hook la función del hook en las páginas de registro e inicio de sesión.

```jsx
const { login, hasError } = useUser();
```

Las funciones quedarían así:

```jsx
// src/pages/login.js

function loginUser(values) {
    login(values);
    if (!hasError) {
      router.push('/');
    }
  }
```

```jsx
// src/pages/register.js

async function registerUser(values) {
    register(values);
    if (!hasError) {
      router.push('/');
    }
  }
```

## Actualizando la barra de navegación

Ahora podemos actualizar la barra de navegación para mostrar el nombre del usuario que ha iniciado la sesión y un botón para cerrarla haciendo uso de todo lo que hemos visto hoy, el componente quedaría así:

```jsx
import { Button } from '@chakra-ui/button';
import { Text } from '@chakra-ui/layout';
import { HStack } from '@chakra-ui/layout';
import { Box, Center, Flex, Heading, Link } from '@chakra-ui/layout';
import NextLink from 'next/link';
import { useUser } from '../hooks/useUser';

const Navbar = () => {
  const { user, logout } = useUser();

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
          {user ? (
            <HStack spacing={4}>
              <Text color="black">{user.name}</Text>
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
                onClick={logout}
              >
                Logout
              </Button>
            </HStack>
          ) : (
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
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Navbar;
```

Como veis, en el caso de que halla un usuario guardado en el contexto mostrará su nombre y el botón de logout, en caso contrario, tendremos el botón que nos permitirá iniciar sesión.

Ahora que podemos acceder a la información del usuario loggeado podremos crear la página del perfil o crear nuevos posts en nuestra aplicación.

Recordad que tenéis el código en [Github](https://github.com/JorgeMayoral/devs-social-app-web) y podés hacer alguna pull request si queréis aportar algo a la app.

Si tienes algún comentario que hacerme puedes contactarme a través de [Twitter](https://twitter.com/Dev_Yorch) o en el formulario de contacto de mi web.

[](https://twitter.com/Dev_Yorch)

[DevYorch](https://yorch.dev)