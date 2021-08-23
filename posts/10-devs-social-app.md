---
title: 'X - Red social para desarrolladores (MERN)'
date: '2021-08-23'
extract: 'Terminamos la primera versión del proyecto al implementar el frontend de nuestra app con React Native, Expo y Typescript.'
---

# X - Red social para desarrolladores (MERN)

Creando una red social para desarrolladores con el stack MERN.

## Introducción

Hoy vamos a ver como queda la nueva versión de frontend de nuestra aplicación, para ello usaremos [React Native](https://reactnative.dev/) y [Expo](https://docs.expo.dev/index.html), y como lenguaje usaré [Typescript](https://www.typescriptlang.org/), que nos permitirán hacer una aplicación nativa para Android, iOS y web con una sola base de código, las imágenes de la app que acompañan al post han sido tomadas en un dispositivo Android.

Como siempre tenéis todo el código en el [repositorio de Github](https://github.com/JorgeMayoral/devs-social-app-native), se aceptan pull requests si alguien se anima a hacer alguna mejora a la app.

# Pantallas

En este apartado hablaré un poco sobre las distintas pantallas de las que se compone la aplicación, no entraré en detalles sobre el código de las mismas ni sobre los componentes, si queréis verlo se podéis consultar el repositorio.

### Inicio de sesión

![Sign In Screen](/postImages/10-signin-screen.jpg)

La primera pantalla que nos encontramos es la de inicio de sesión, un simple formulario con los campos necesarios para poder acceder a la app, tras hacer login el token se almacena para poder ser usado cuando es necesario.

### Registro

![Sign Up Screen](/postImages/10-signup-screen.jpg)

La pantalla de registro es muy similar a la de inicio de sesión, solo se añaden los campos necesarios al formulario.

### Inicio

![Home Screen](/postImages/10-home-screen.jpg)

Tras iniciar sesión o registrar una nueva cuenta accederemos a la pantalla de inicio, en ella podemos ver la estructura que seguirán las distintas secciones de nuestra aplicación, un titulo con el nombre de la pantalla en la que nos encontramos, el contenido de la misma y una barra de navegación que nos permitirá acceder a las distintas secciones.

En la pantalla de inicio veremos los posts de los usuarios a los que seguimos, en una cuenta nueva que no siga a ningún otro usuario se mostrará un texto indicando que no hay contenido que mostrar hasta que empieces a seguir a más usuarios.

Las tarjetas de los posts muestran el nombre y nombre de usuario del autor, el cuerpo del post, un botón de like junto con el número total de likes que tiene el post y la fecha en la que se publicó.

### Perfil

![Profile Screen](/postImages/10-profile-screen.jpg)

En la pantalla de perfil del usuario que ha iniciado sesión en la app vemos distintas estadísticas sobre el mismo a la vez que los posts que ha publicado.

### Usuario

![User Screen](/postImages/10-user-screen.jpg)

Al acceder al perfil de otro usuario pulsando sobre su nombre en un posts podemos ver una  pantalla muy similar a la del perfil con el añadido de un botón que nos permitirá seguir, o dejar de seguir, al usuario.

### Publicar

![Publish Screen](/postImages/10-publish-screen.jpg)

En esta pantalla nos encontramos simplemente con un sencillo formulario en el que podemos escribir el contenido del post que queramos publicar.

### Explorar

![Explore Screen](/postImages/10-explore-screen.jpg)

La pantalla de explorar es muy similar a la de inicio, pero en ella se muestran los posts de todos los usuarios en orden cronológico (de más reciente a más antiguo), lo que nos permitirá descubrir a nuevos usuarios a los que seguir.

Todas las listas de posts hacen uso del sistema de paginación por lo que no solicitan todos los posts al servidor, pide los 20 primeros y al acercarse al final de la lista pide otros 20, de esta forma las peticiones se resuelven más rápidamente al no tener que recibir mucha información con cada petición.

### Ajustes

![Settings Screen](/postImages/10-settings-screen.jpg)

Finalmente la pantalla de ajustes solo muestra actualmente una opción que nos permitirá cerrar la sesión del usuario.

En un futuro se podrán añadir nuevas opciones como cambio entre tema claro u oscuro, opciones relativas a notificaciones, o dar la posibilidad de eliminar la cuenta del usuario, por ejemplo.

## Funcionamiento

En este apartado quiero comentar muy por encima algunos detalles del funcionamiento de la aplicacón.

### Almacenamiento del token

Para almacenar el token de forma segura usamos la librería [secure-store de expo](https://docs.expo.dev/versions/latest/sdk/securestore/), que nos permite guardar un par de clave-valor encriptado en el dispositivo, esto solo funciona en dispositivos Android e iOS.

Implementamos tres sencillos métodos que nos permitirán guardar, obtener y eliminar el token.

```tsx
import * as SecureStore from 'expo-secure-store'

const KEY = 'devs-social-token'

export const saveToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync(KEY, token)
}

export const getToken = async (): Promise<string | null> => {
  let token = await SecureStore.getItemAsync(KEY)

  return token
}

export const removeToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(KEY)
}
```

### Estado global

Para poder utilizar el token en cualquier parte de la aplicación donde lo necesitemos usaremos la librería [zustand](https://github.com/pmndrs/zustand) que nos permitirá manejar el estado de una forma muy sencilla.

Haciendo uso de este custom hook podremos hacer uso del token e interactuar con el almacenamiento del mismo.

```tsx
import { getToken, removeToken, saveToken } from '../utils/tokenStorage'
import create from 'zustand'

export const useTokenStore = create<any>(set => ({
  token: undefined,
  load: async () => {
    const data = await getToken()
    set({token: data})
  },
  store: async (token: string) => await saveToken(token),
  delete: async () => {
    await removeToken()
    set({token: undefined})
  }
}))
```

### Servicios

Para hacer las llamadas al servidor tenemos distintos servicios (en este caso vamos a ver solo el de autentificación)

Expo nos permite exportar contenido del archivo de configuración app.config.js como constantes, de esta forma podemos guardar ahí la URL del servidor para poder utilizarla en los servicios.

```tsx
import axios from 'axios'
import Constants from 'expo-constants'
import { SignInData, SignUpData } from '../types'
import { saveToken } from '../utils/tokenStorage'

const extra = Constants.manifest?.extra

export const login = async (data: SignInData): Promise<boolean> => {
  const url = `${extra?.apiUrl}/v1/user/login`

  try {
    const response = await axios.post(url, data)
    if (response.status === 200) {
      await saveToken(response.data.token)
      return true
    }
  } catch (e) {
    return false
  }

  return false
}

export const register = async (data: SignUpData): Promise<boolean> => {
  const url = `${extra?.apiUrl}/v1/user/register`

  try {
    const response = await axios.post(url, data)

    if (response.status === 201) {
      await saveToken(response.data.token)
      return true
    }
  } catch (e) {
    return false
  }

  return false
}
```

### Tipos

En cuanto al uso de Typescript en la aplicación hay mucho margen de mejora, como añadir más tipos propios de la app y ser más estricto en los tipos de retorno y de los parametros de los distintos métodos.

Aquí como ejemplo los tipos que son usados en los servicios de autentificación vistos anteriormente.

```tsx
export type SignInData = {
  username: string,
  password: string
}

export type SignUpData = {
  username: string,
  name: string,
  email: string,
  password: string
}
```

## Build de la aplicación

Expo nos facilita mucho la build de la app como podemos ver en su [documentación](https://docs.expo.dev/distribution/building-standalone-apps/), puesto tras hacer login en su CLI podemos hacer la build en la nube con un simple comando

```bash
# Ejemplo Android
expo build:android -t apk
```

Con esto tendremos una apk disponible para subirla a Google Play y permitir que cualquiera pueda usar nuestra aplicación.

---

Con esto termino esta serie de posts sobre la creación de una red social, la app tiene las funcionalidades más básicas implementadas, continuaré iterando sobre ella para añadir mejoras y soluciones a los bugs que me vaya encontrando, los cambios serán publicados en el repositorio de Github.

---

Esto es todo por hoy, si tienes algún comentario que hacerme puedes contactarme a través de [Twitter](https://twitter.com/Dev_Yorch) o en el formulario de contacto de mi web. Y recuerda, las aportaciones al proyecto son bienvenidas.

[](https://twitter.com/Dev_Yorch)

[DevYorch](https://yorch.dev)

[JorgeMayoral - Overview](https://github.com/JorgeMayoral)