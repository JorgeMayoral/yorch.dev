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

const Contacto = () => {
  const toast = useToast();

  async function sendMail(values) {
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
      status: data.code === 200 ? 'success' : error,
      isClosable: true,
      duration: 9000,
    });
  }

  return (
    <Layout>
      <Head>
        <title>Contacto | DevYorch</title>
      </Head>
      <Heading>Contacto</Heading>
      <Text mb={4}>
        Puedes contactarme rellenando este formulario, con un email a{' '}
        <Link color="#00adb5" href="mailto:mayoralalvarez@gmail.com">
          mayoralalvarezj@gmail.com
        </Link>
        , o siguiendo los enlaces a mis redes sociales al final de esta página.
      </Text>

      <Formik
        initialValues={{ contactName: '', email: '', subject: '', text: '' }}
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

      <VStack spacing="1em">
        <Text>Enlaces a mis perfiles en redes sociales:</Text>
        <Text>
          <Icon as={AiFillGithub} />{' '}
          <Link
            color="#00adb5"
            href="https://github.com/JorgeMayoral"
            isExternal
          >
            JorgeMayoral
          </Link>
        </Text>
        <Text>
          <Icon as={AiFillTwitterSquare} />{' '}
          <Link color="#00adb5" href="https://twitter.com/Dev_Yorch" isExternal>
            Dev_Yorch
          </Link>
        </Text>
        <Text>
          <Icon as={AiFillLinkedin} />{' '}
          <Link
            color="#00adb5"
            href="https://linkedin.com/in/jorgemayoralalvarez"
            isExternal
          >
            Jorge Mayoral Álvarez
          </Link>
        </Text>
      </VStack>
    </Layout>
  );
};

export default Contacto;
