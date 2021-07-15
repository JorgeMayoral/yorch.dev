---
title: 'VI - Red social para desarrolladores (MERN)'
date: '2020-06-15'
extract: 'Retomamos el desarrollo después de meses, hablamos de algunos cambios necesarios y de otros que ya se han hecho.'
---

# VI - Red social para desarrolladores (MERN)

Creando una red social para desarrolladores con el stack MERN.

## Introducción

Tras varios meses sin trabajar en el proyecto lo estoy volviendo a retomar poco a poco, hay varios cambios que hacer tanto en el back como en el front.

En este post comentaré algunos cambios y añadidos que ya he hecho y otros que quedan pendientes.

Recordad que tenéis el código en [Github](https://github.com/JorgeMayoral/devs-social-app-server) y podés hacer alguna pull request si queréis aportar algo a la app.

## Backend

### Tests

He añadido tests para los controladores del usuario con [Jest](https://jestjs.io/es-ES/), falta por añadir tests para los posts,  y mejorar los ya existentes.

### Mock data

También he añadido scripts y datos para poder poblar la base de datos y tener datos con los que hacer pruebas durante el desarrollo del frontend.

### Rutas

Hay una nueva ruta llamada "me", devuelve información del usuario que ha iniciado seseión. Era necesaria para el estado actual del frontend, si en un futuro dejo de necesitarla la eliminaré.

### Sesión

Actualmente la sesión de un usuario se almacena como una cookie, pero no estoy del todo contento con como está funcionando ahora mismo, no descarto cambiarlo por [Json Web Token](https://jwt.io/) más adelante.

### Typescript

He pensado en migrar la app a Typescript para prácticar y para poder aprovechar la seguridad que dan los tipos durante el desarrollo, primero quiero solucionar los problemas actuales y dejar la app en un mejor estado y con un mayor número de tests antes de comenzar la migración.

## Frontend

El frontend tenía varios problemas, no estaba muy contento con el diseño y había varios problemas con la gestión de los estados globales y el almacenamiento de la sesión del usuario.

Solucionar estos problemas me llevará un tiempo, y no descarto reiniciar el desarrollo del front para ir poco a poco y aprender a usar [Cypress](https://www.cypress.io/) para hacer tests E2E y asegurar su correcto funcionamiento.

---

Si tienes algún comentario que hacerme puedes contactarme a través de [Twitter](https://twitter.com/Dev_Yorch) o en el formulario de contacto de mi web.

[](https://twitter.com/Dev_Yorch)

[DevYorch](https://yorch.dev)