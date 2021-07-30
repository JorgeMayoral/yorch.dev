---
title: 'IX - Red social para desarrolladores (MERN)'
date: '2021-07-30'
extract: 'Creamos la imagen de Docker de la aplicación e implementamos un sistema de Integración Continua y Entrega Continua (CI/CD) con Github Actions mediante el cual ejecutamos los tests y construimos la imagen.'
---

# IX - Red social para desarrolladores (MERN)

Creando una red social para desarrolladores con el stack MERN.

## Introducción

Hoy vamos a implementar un pequeño sistema de CI/CD para nuestra aplicación con [Github Actions](https://github.com/features/actions) y [Docker](https://www.docker.com/), este sistema se encargará de ejecutar los tests cuando se reciba una pull request o un push a la rama main, y crearan la imagen de docker del backend y la publicarán en [Docker Hub](https://hub.docker.com/).

# Docker

### Dockerfile

Lo primero que necesitamos es crear el archivo Dockerfile en la raíz del proyecto, este archivo será la "receta" que utilizará Docker para crear la imagen del servidor.

```docker
# Dockerfile
FROM node:16

WORKDIR /app

ADD package.json ./
ADD package-lock.json ./

RUN npm install

ADD . .

CMD npm start
```

Como podéis ver, antes de copiar el código de la aplicación instalamos la dependencias, esto lo hacemos así para aprovechar la caché de Docker y solo instalar las dependencias cuando estas cambien y no cuando solo haya cambiado el código, ahorrando tiempo en la build de la imagen.

También necesitamos un `.dockerignore` para indicar a Docker los archivos y carpetas que no queremos añadir a la imagen.

```docker
# Folders
node_modules
.git
.github

# Files
.gitignore
.env
.env.example
docker-compose.yml
Dockerfile
.dockerignore
```

### Docker Compose

A la hora de levantar la aplicación en el servidor lo haremos con Docker Compose, para así levantar al mismo tiempo la base de datos y permitir que ambos contenedores se puedan comunicar, además de especificar otras opciones.

```yaml
# docker-compose.yml
version: '3'

services:
  mongodb:
    image: 'mongo:latest'
    container_name: 'mongodb'
    volumes:
      - ${PWD}/db:/data/db
    ports:
      - '27017:27017'
    expose:
      - 27017
    restart: always
    environment:
      - MONGO_INITDB_ROOT_USERNAME
      - MONGO_INITDB_ROOT_PASSWORD

  backend:
    image: 'y0rch/devs-social-backend:latest'
    container_name: 'backend'
    ports:
      - '${PORT}:${PORT}'
    expose:
      - ${PORT}
    restart: always
    environment:
      - PORT
      - MONGO_URI
      - JWT_SECRET_KEY
    depends_on:
      - mongodb
```

En este archivo creamos dos servicios, el primero, la base de datos, usará una imagen de MongoDB, creará un volumen en el servidor donde almacenará la información, para que en el caso de un reinicio (por ejemplo) no se pierda toda la información contenida en la base de datos, expondremos el puerto, indicamos a Docker que siempre se reinicie para que si hay un problema no tengamos que reiniciar el contenedor manualmente y especificamos las variables de entorno que vamos a necesitar.

En el segundo servicio tenemos la app, el nombre de la imagen es el que usamos al subirla a Docker Hub, el resto de las opciones son muy similares a las de la base de datos, pero en la última especificamos que este servicio depende de MongoDB, para que la imagen espere a que la base de datos este lista antes de levantarse para poder establecer la conexión.

Para establecer las variables de entorno creamos un archivo `.env` que tiene esta forma:

```jsx
# MongoDb environment variables
MONGO_INITDB_ROOT_USERNAME=''
MONGO_INITDB_ROOT_PASSWORD=''

# Backend environment variables
PORT=''
MONGO_URI='mongodb://mongodb:27017/devs-social'
JWT_SECRET_KEY=''
```

## Github Actions

Vamos a crear una Github Action que se encargue de ejecutar los tests y si estos pasan se creará una nueva versión de la imagen de Docker y se subirá a Docker Hub.

El archivo se llamará `ci-cd.yml` y lo añadiremos al directorio `.github/workflows` .

Este archivo nos quedará así:

```yaml
# ci-cd.yml

# This workflow will run the project tests
name: CI/CD

on:
  push:
    branches: [main]
    paths:
      - 'src/**/*'
      - 'Dockerfile'
  pull_request:
    branches: [main]
    paths:
      - 'src/**/*'

jobs:
  ci:
    name: Run tests
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [12.x, 14.x, 16.x]
        mongodb-version: ['4.0', '4.2', '4.4']

    steps:
      - name: Git checkout
        uses: actions/checkout@v2

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v2
        with:
          node-version: ${{ matrix.node-version }}

      - name: Start MongoDB
        uses: supercharge/mongodb-github-action@1.6.0
        with:
          mongodb-version: ${{ matrix.mongodb-version }}

      - run: npm ci

      - name: Run tests
        env:
          PORT: 5000
          MONGO_URI: 'mongodb://localhost:27017/app'
          MONGO_URI_TEST: 'mongodb://localhost:27017/test'
          JWT_SECRET_KEY: JWT_TEST_KEY
        run: npm test token && npm test user && npm test post

  cd:
    name: Buils Docker image and push to Docker Hub
    runs-on: ubuntu-latest
    needs: ci

    steps:
      - name: Git checkout
        uses: actions/checkout@v2

      - name: Docker login
        run: docker login -u ${{ secrets.DOCKER_USER }} -p ${{ secrets.DOCKER_PASSWORD }}

      - name: Build
        run: docker build -t backend .

      - name: Tags
        run:  |
          docker tag backend ${{ secrets.DOCKER_USER }}/devs-social-backend:${{ github.sha }}
          docker tag backend ${{ secrets.DOCKER_USER }}/devs-social-backend:latest
          
      - name: Push
        run: |
          docker push ${{ secrets.DOCKER_USER }}/devs-social-backend:${{ github.sha }}
          docker push ${{ secrets.DOCKER_USER }}/devs-social-backend:latest
```

Vamos a explicar este archivo poco a poco.

En la primera parte indicamos el nombre del workflow y cuando se va a ejecutar, en este caso cuando se reciba un push o una pull request a la rama main y hayan cambiado o el archivo Dockerfile o algún archivo de la carpeta src.

```yaml
name: CI/CD

on:
  push:
    branches: [main]
    paths:
      - 'src/**/*'
      - 'Dockerfile'
  pull_request:
    branches: [main]
    paths:
      - 'src/**/*'
```

A continuación indicamos los jobs que se ejecutarán, el primero será el encargado de ejecutar los tests.

Le damos un nombre al job y le decimos que se ejecutará en la última versión de ubuntu, posteriormente definimos una estrategia según la cual se ejecutará el job, en ella indicamos que queremos definir una matriz con 3 versiones de node y otras 3 versiones de mongodb, por lo que los test se ejecutarán en las 9 posibles combinaciones.

Finalmente definimos los pasos del job, lo más importante a destacar es que la instalación de las dependencias la haremos con `npm ci` para que npm aplique una serie de optimizaciones apropiadas para integración continua y después ejecutamos los tests estableciendo las variables de entorno, debido a un bug debo ejecutar los tests por separado cuando esté solucionado se podrán ejecutar con `npm test`.

```yaml
jobs:
  ci:
    name: Run tests
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [12.x, 14.x, 16.x]
        mongodb-version: ['4.0', '4.2', '4.4']

    steps:
      - name: Git checkout
        uses: actions/checkout@v2

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v2
        with:
          node-version: ${{ matrix.node-version }}

      - name: Start MongoDB
        uses: supercharge/mongodb-github-action@1.6.0
        with:
          mongodb-version: ${{ matrix.mongodb-version }}

      - run: npm ci

      - name: Run tests
        env:
          PORT: 5000
          MONGO_URI: 'mongodb://localhost:27017/app'
          MONGO_URI_TEST: 'mongodb://localhost:27017/test'
          JWT_SECRET_KEY: JWT_TEST_KEY
        run: npm test token && npm test user && npm test post
```

A continuación tenemos el último job que se encargará de hacer la build de la imagen de docker y se subirá a Docker Hub.

Lo primero a destacar es que indicamos que este job depende del anterior (ci), para evitar que se cree una imagen de una versión que podría no funcionar correctamente si los tests no han pasado.

Más adelante hacemos login en Docker Hub, para ello hemos de añadir a los secretos del repositorio nuestro nombre de usuario y la contraseña.

Tras hacer la build  nombramos la imágen de dos formas, una con latest para tener disponible así al última versión, y otra con el SHA del commit desde el que se está creando la imágen, para que en el caso de que nos encontremos algún problema podamos recuperar una versión que sea estable.

Para terminar subimos ambas imágenes a Docker Hub.

```yaml
cd:
    name: Buils Docker image and push to Docker Hub
    runs-on: ubuntu-latest
    needs: ci

    steps:
      - name: Git checkout
        uses: actions/checkout@v2

      - name: Docker login
        run: docker login -u ${{ secrets.DOCKER_USER }} -p ${{ secrets.DOCKER_PASSWORD }}

      - name: Build
        run: docker build -t backend .

      - name: Tags
        run:  |
          docker tag backend ${{ secrets.DOCKER_USER }}/devs-social-backend:${{ github.sha }}
          docker tag backend ${{ secrets.DOCKER_USER }}/devs-social-backend:latest
          
      - name: Push
        run: |
          docker push ${{ secrets.DOCKER_USER }}/devs-social-backend:${{ github.sha }}
          docker push ${{ secrets.DOCKER_USER }}/devs-social-backend:latest
```

Tras esto siempre que hagamos cambios al repositorio se ejecutarán los tests y si estos pasan tendremos una nueva imagen de la aplicación disponible para desplegarla en el servidor.

Podéis encontrar la imagen en [Docker Hub](https://hub.docker.com/repository/docker/y0rch/devs-social-backend).

---

Con esto ya tendríamos una primera versión del backend terminada y desplegada en el servidor lista para recibir peticiones, en próximos posts hablaremos del frontend.

---

Esto es todo por hoy, si tienes algún comentario que hacerme puedes contactarme a través de [Twitter](https://twitter.com/Dev_Yorch) o en el formulario de contacto de mi web. Y recuerda, las aportaciones al proyecto son bienvenidas.

[](https://twitter.com/Dev_Yorch)

[DevYorch](https://yorch.dev)

[JorgeMayoral - Overview](https://github.com/JorgeMayoral)
