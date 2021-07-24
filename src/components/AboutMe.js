import {
  Container,
  Stack,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Image,
  Icon,
  IconButton,
  createIcon,
  IconProps,
  useColorModeValue,
} from '@chakra-ui/react';

const AboutMe = () => {
  return (
    <Container maxW={'7xl'}>
      <Stack
        align={'center'}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
        direction={{ base: 'column', md: 'row' }}
      >
        <Stack flex={1} spacing={{ base: 5, md: 10 }}>
          <Heading
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}
          >
            <Text
              as={'span'}
              position={'relative'}
              _after={{
                content: "''",
                width: 'full',
                height: '30%',
                position: 'absolute',
                bottom: 1,
                left: 0,
                bg: '#00adb5',
                zIndex: -1,
              }}
            >
              Hola 👋, mi nombre es Jorge.
            </Text>
            <br />
            <Text as={'span'} color={'#00adb5'}>
              Soy desarrollador web.
            </Text>
          </Heading>
          <Text as="kbd">MongoDB | Express | React | Node</Text>
          <Text>
            Mi nombre es Jorge Mayoral Álvarez, nací en 1993 y soy programador
            web, aunque no me dedico a ello actualmente. Siempre me ha gustado
            la programación y la informática, aunque tardé en dar con las
            tecnologías con las que realmente me sentía cómodo, finalmente me
            encontré con el desarrollo web, que me permite crear cosas y
            permitir que otros las puedan probar de manera muy sencilla.
          </Text>
          <Text>
            Actualmente me especializo en el desarrollo web (tanto backend como
            frontend) con el stack MERN, aunque siempre estoy dispuesto a
            aprender nuevas tecnologías, el gusto por aprender cosas nuevas creo
            que es un requisito indispensable de todo buen programador.
          </Text>
          <Text>
            Para cualquier consulta no dudes en pasarte por la sección de
            contacto, estaré encantado de atenderte.
          </Text>
        </Stack>
        <Flex
          flex={1}
          justify={'center'}
          align={'center'}
          position={'relative'}
          w={'full'}
        >
          <Blob
            w={'150%'}
            h={'150%'}
            position={'absolute'}
            top={'-20%'}
            left={0}
            zIndex={-1}
            color="#00adb5"
          />
          <Box
            position={'relative'}
            height={'300px'}
            rounded={'2xl'}
            boxShadow={'2xl'}
            width={'full'}
            overflow={'hidden'}
          >
            <Image
              alt={'Hero Image'}
              fit={'cover'}
              align={'center'}
              w={'100%'}
              h={'100%'}
              src={'https://avatars.githubusercontent.com/u/11541870'}
            />
          </Box>
        </Flex>
      </Stack>
    </Container>
  );
};

export const Blob = (props) => {
  return (
    <Icon
      width={'100%'}
      viewBox="0 0 578 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M239.184 439.443c-55.13-5.419-110.241-21.365-151.074-58.767C42.307 338.722-7.478 282.729.938 221.217c8.433-61.644 78.896-91.048 126.871-130.712 34.337-28.388 70.198-51.348 112.004-66.78C282.34 8.024 325.382-3.369 370.518.904c54.019 5.115 112.774 10.886 150.881 49.482 39.916 40.427 49.421 100.753 53.385 157.402 4.13 59.015 11.255 128.44-30.444 170.44-41.383 41.683-111.6 19.106-169.213 30.663-46.68 9.364-88.56 35.21-135.943 30.551z"
        fill="currentColor"
      />
    </Icon>
  );
};

export default AboutMe;
