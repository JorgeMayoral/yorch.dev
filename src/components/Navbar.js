import { Box, Center, Flex, Heading, Link, Stack } from '@chakra-ui/layout';
import NextLink from 'next/link';

const Navbar = () => {
  return (
    <Flex zIndex={1} position="sticky" top={0} bg="#fff" p={4}>
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NextLink href="/">
          <Link _hover={{ textDecoration: 'none' }}>
            <Center>
              <Heading color="#00adb5" size="lg">
                Dev
              </Heading>
              <Heading size="lg">Yorch</Heading>
            </Center>
          </Link>
        </NextLink>
        <Box ml="auto">
          <Stack direction="row">
            <NextLink href="/">
              <Link mx={2}>
                <a>Inicio</a>
              </Link>
            </NextLink>
            <NextLink href="/blog">
              <Link mx={2}>
                <a>Blog</a>
              </Link>
            </NextLink>
            <NextLink href="/contacto">
              <Link mx={2}>
                <a>Contacto</a>
              </Link>
            </NextLink>
          </Stack>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Navbar;
