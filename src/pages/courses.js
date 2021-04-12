import { Button } from '@chakra-ui/button';
import { Box, Heading, Link, Text } from '@chakra-ui/layout';
import Head from 'next/head';
import Layout from '../components/Layout';

const courses = () => {
  return (
    <Layout>
      <Head>
        <title>Cursos | DevYorch</title>
      </Head>

      <Heading>Cursos</Heading>

      <Text mb={4}>
        Aquí puedes ver una lista de cursos que he realizado con un enlace a su
        correspondiente certificado si lo hay.
      </Text>

      <Box mt={8}>
        <Text fontSize="xl" mb={2}>
          Bash para el día a día: Scripting & Productividad
        </Text>
        <Text mb={2}>
          Curso de{' '}
          <Link
            href="https://pro.codely.tv/library/curso-bash/148078/about/"
            isExternal
            color="#00adb5"
            target="blank"
          >
            CodelyTV
          </Link>{' '}
          sobre scripting en bash.
        </Text>
        <Link href="/courses/curso-bash.pdf" target="blank">
          <Button bgColor="#00adb5">Certificado</Button>
        </Link>
      </Box>

      <Box mt={8}>
        <Text fontSize="xl" mb={2}>
          Makefile: El punto de entrada a tus proyectos
        </Text>
        <Text mb={2}>
          Curso de{' '}
          <Link
            href="https://pro.codely.tv/library/makefiles/168370/about/"
            target="blank"
            isExternal
            color="#00adb5"
          >
            CodelyTV
          </Link>{' '}
          sobre la elaboración de Makefiles.
        </Text>
        <Link href="/courses/makefiles.pdf" target="blank">
          <Button bgColor="#00adb5">Certificado</Button>
        </Link>
      </Box>

      <Box mt={8}>
        <Text fontSize="xl" mb={2}>
          Principios SOLID aplicados
        </Text>
        <Text mb={2}>
          Curso de{' '}
          <Link
            href="https://pro.codely.tv/library/principios-solid-aplicados/77070/about/"
            isExternal
            color="#00adb5"
            target="blank"
          >
            CodelyTV
          </Link>{' '}
          sobre principios SOLID.
        </Text>
        <Link href="/courses/principios-solid-aplicados.pdf" target="blank">
          <Button bgColor="#00adb5">Certificado</Button>
        </Link>
      </Box>

      <Box mt={8}>
        <Text fontSize="xl" mb={2}>
          Arquitectura Hexagonal
        </Text>
        <Text mb={2}>
          Curso de{' '}
          <Link
            href="https://pro.codely.tv/library/arquitectura-hexagonal/66748/about/"
            isExternal
            color="#00adb5"
            target="blank"
          >
            CodelyTV
          </Link>{' '}
          sobre arquitectura hexagonal.
        </Text>
        <Link href="/courses/arquitectura-hexagonal.pdf" target="blank">
          <Button bgColor="#00adb5">Certificado</Button>
        </Link>
      </Box>
    </Layout>
  );
};

export default courses;
