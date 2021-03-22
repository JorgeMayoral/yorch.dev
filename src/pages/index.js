import { Box, Heading, Link, Stack, Text, VStack } from '@chakra-ui/layout';
import { Button, Divider, Image } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';
import Layout from './../components/Layout';
import Head from 'next/head';

const Index = () => (
  <>
    <Layout>
      <Head>
        <title>DevYorch</title>
      </Head>
      <Stack spacing={4} direction="column">
        <Box>
          <Heading color="#222831">Hola 👋, mi nombre es Jorge.</Heading>
          <Text>Soy desarrollador web.</Text>
          <Text as="kbd">MongoDB | Express | React | Node</Text>
        </Box>
        <Divider />
        <Box minW="inherit">
          <VStack spacing={4}>
            <Image
              src="https://avatars.githubusercontent.com/u/11541870"
              alt="Jorge Mayoral Álvarez"
              borderRadius="md"
              boxSize="15em"
              mr={4}
              float="left"
            />
            <Text>
              Mi nombre es Jorge Mayoral Álvarez,nací en 1993 y soy programador
              web, aunque no me dedico a ello actualmente. Siempre me ha gustado
              la programación y la informática, aunque tardé en dar con las
              tecnologías con las que realmente me sentía cómodo, finalmente me
              encontré con el desarrollo web, que me permite crear cosas y
              permitir que otros las puedan probar de manera muy sencilla.
            </Text>
            <Text>
              Actualmente me especializo en el desarrollo web (tanto backend
              como frontend) con el stack MERN, aunque siempre estoy dispuesto a
              aprender nuevas tecnologías, el gusto por aprender cosas nuevas
              creo que es un requisito indispensable de todo buen programador.
            </Text>
            <Text>
              Para cualquier consulta no dudes en pasarte por la sección de
              contacto, estaré encantado de atenderte.
            </Text>
          </VStack>
        </Box>
        <Divider />
        <Box>
          <Text fontSize="2xl" mb={4}>
            Mis Proyectos
          </Text>
          <Box>
            <Text fontSize="xl" mb={2}>
              Devs Social App
            </Text>
            <Text mb={2}>
              Devs Social App (nombre provisional), es una red social pensada
              para desarrolladores. Aún se encuentra en desarrollo, por ahora su
              funcionalidad es muy similar a Twitter, pero planeo añadir otras
              funciones en el futuro.
            </Text>
            <Text mb={2}>
              El backend está desarrollado con Node, Express como framework web
              y MongoDB como base de datos. El frontend esta construido con
              Next.js y Chakra UI (como esta misma web). Si tienes interés en
              conocer más sobre la app no dudes en consultar el código publicado
              en mi perfil de Github, o, también puedes pasarte por mi blog,
              donde estoy publicando una serie de posts en los que comento el
              desarrollo de la aplicación.
            </Text>
            <Stack spacing={4} mt={4}>
              <Link
                href="https://github.com/JorgeMayoral/devs-social-app-server"
                isExternal
              >
                <Button leftIcon={<FaGithub />} bgColor="#00adb5">
                  Código servidor
                </Button>
              </Link>
              <Link
                href="https://github.com/JorgeMayoral/devs-social-app-web"
                isExternal
              >
                <Button leftIcon={<FaGithub />} bgColor="#00adb5">
                  Código web
                </Button>
              </Link>
            </Stack>
          </Box>
          <Box mt={8}>
            <Text fontSize="xl" mb={2}>
              Hacker News Reader
            </Text>
            <Text mb={2}>
              HN Reader es un pequeño proyecto creado con el fin de aprender a
              utilizar React Native.
            </Text>
            <Text mb={2}>
              Se trata de un lector de noticias publicadas en{' '}
              <Link
                href="https://news.ycombinator.com/"
                isExternal
                color="#00adb5"
              >
                Hacker News
              </Link>
              , para ello se hace uso de su{' '}
              <Link
                href="https://github.com/HackerNews/API"
                isExternal
                color="#00adb5"
              >
                API
              </Link>{' '}
              oficial. La app ha sido desarrollada para Android, aunque no hace
              uso de muchas funciones exclusivas, por lo que podría ser adaptada
              fácilmente para ser usada en iOS.
            </Text>
            <Stack spacing={4} mt={4}>
              <Link
                href="https://github.com/JorgeMayoral/hn-react-native"
                isExternal
              >
                <Button leftIcon={<FaGithub />} bgColor="#00adb5">
                  Código
                </Button>
              </Link>
            </Stack>
          </Box>
        </Box>
      </Stack>
    </Layout>
  </>
);

export default Index;
