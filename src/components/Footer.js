import {
  Box,
  Center,
  chakra,
  Container,
  Heading,
  Link,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from '@chakra-ui/react';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';
import NextLink from 'next/link';

const Logo = () => {
  return (
    <Box _hover={{ cursor: 'pointer' }}>
      <NextLink href="/">
        <Center>
          <Heading color="#00adb5" size="lg">
            Dev
          </Heading>
          <Heading size="lg">Yorch</Heading>
        </Center>
      </NextLink>
    </Box>
  );
};

const SocialButton = ({ children, label, href }) => {
  return (
    <chakra.button
      bg="blackAlpha.100"
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: 'blackAlpha.200',
      }}
    >
      <Link href={href} isExternal>
        <VisuallyHidden>{label}</VisuallyHidden>
        {children}
      </Link>
    </chakra.button>
  );
};

const Footer = () => {
  return (
    <Box bg="gray.50" color="gray.700">
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Logo />
        <Stack direction={'row'} spacing={6}>
          <SocialButton
            label={'Twitter'}
            href={'https://twitter.com/Dev_Yorch'}
          >
            <FaTwitter />
          </SocialButton>
          <SocialButton
            label={'Github'}
            href={'https://github.com/JorgeMayoral'}
          >
            <FaGithub />
          </SocialButton>
          <SocialButton
            label={'Linkedin'}
            href={'https://linkedin.com/in/jorgemayoralalvarez'}
          >
            <FaLinkedin />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
