import { Button } from '@chakra-ui/button';
import { Heading, VStack, Link, Text } from '@chakra-ui/layout';
import { Form, Formik } from 'formik';
import Layout from '../components/Layout';
import {
  AiFillLinkedin,
  AiFillGithub,
  AiFillTwitterSquare,
} from 'react-icons/ai';
import Icon from '@chakra-ui/icon';
import InputField from './../components/InputField';
import { useToast } from '@chakra-ui/toast';
import Head from 'next/head';
import { Box, Flex, Stack } from '@chakra-ui/react';

const Contacto = () => {
  const toast = useToast();

  async function sendMail(values) {
    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      toast({
        description: data.message,
        status: 'success',
        isClosable: true,
        duration: 9000,
      });
    } catch (error) {
      console.error(error.message);
      toast({
        description: 'Algo fue mal, intentalo de nuevo más tarde.',
        status: 'error',
        isClosable: true,
        duration: 9000,
      });
    }
  }

  return (
    <Layout>
      <Flex minH={'100vh'} align={'center'} justify={'center'}>
        <Head>
          <title>Contacto | DevYorch</title>
        </Head>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Contacto</Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              Puedes contactarme rellenando este formulario, con un email a{' '}
              <Link color="#00adb5" href="mailto:mayoralalvarez@gmail.com">
                mayoralalvarezj@gmail.com
              </Link>
              , o siguiendo los enlaces a mis redes sociales al final de esta
              página.
            </Text>
          </Stack>

          <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
            <Stack spacing={4}>
              <Formik
                initialValues={{
                  contactName: '',
                  email: '',
                  subject: '',
                  text: '',
                }}
                onSubmit={async (values, actions) => {
                  actions.setSubmitting(true);
                  await sendMail(values);
                  actions.setSubmitting(false);
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <InputField name="contactName" label="Nombre" />
                    <InputField name="email" label="Email" type="email" />
                    <InputField name="subject" label="Asunto" />
                    <InputField name="text" label="Mensaje" textarea />
                    <Button
                      type="submit"
                      bgColor="#00adb5"
                      color="white"
                      mb={4}
                      _hover={{ bgColor: '#00a6ae' }}
                      isLoading={isSubmitting}
                    >
                      Enviar
                    </Button>
                  </Form>
                )}
              </Formik>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </Layout>
  );
};

export default Contacto;
