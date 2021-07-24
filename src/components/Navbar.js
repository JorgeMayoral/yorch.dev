import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Box, Center, Flex, Heading, Link, Stack } from '@chakra-ui/layout';
import { HStack, IconButton, useDisclosure } from '@chakra-ui/react';
import NextLink from 'next/link';

const Links = ['Inicio', 'Blog', 'Contacto'];

const NavLink = ({ children }) => (
  <NextLink href={children === 'Inicio' ? '/' : `/${children.toLowerCase()}`}>
    <Link
      px={2}
      py={1}
      rounded={'md'}
      _hover={{ textDecoration: 'none', bg: 'gray.200' }}
    >
      {children}
    </Link>
  </NextLink>
);

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box bg="#fff" px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Abrir Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
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
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};

export default Navbar;
