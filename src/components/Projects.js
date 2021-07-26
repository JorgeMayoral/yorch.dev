import {
  Avatar,
  Box,
  Button,
  chakra,
  Container,
  Flex,
  Icon,
  Link,
  SimpleGrid,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';

import { FaGithub, FaGooglePlay, FaGlobe } from 'react-icons/fa';

import myProjects from './../data/projects.json';

const LinkButton = ({ site, url, text }) => {
  const linkIcons = {
    github: <FaGithub />,
    googleplay: <FaGooglePlay />,
    web: <FaGlobe />,
  };

  return (
    <Link href={url} isExternal>
      <Button leftIcon={linkIcons[site]} bgColor="#00adb5" color="gray.700">
        {text}
      </Button>
    </Link>
  );
};

function ProjectCard(props) {
  const { name, description, links } = props;
  return (
    <Flex
      boxShadow={'lg'}
      maxW={'640px'}
      direction={{ base: 'column-reverse', md: 'row' }}
      width={'full'}
      rounded={'xl'}
      p={10}
      justifyContent={'space-between'}
      position={'relative'}
      bg={'white'}
    >
      <Flex
        direction={'column'}
        textAlign={'left'}
        justifyContent={'space-between'}
      >
        <chakra.p fontWeight={'bold'} fontSize={25}>
          {name}
        </chakra.p>
        <chakra.p fontSize={'15px'} pb={4}>
          {description}
        </chakra.p>
        <VStack spacing={4} mt={4} align="start">
          {links.map((link) => (
            <LinkButton url={link.link} site={link.site} text={link.text} />
          ))}
        </VStack>
      </Flex>
    </Flex>
  );
}

const Projects = () => {
  return (
    <Flex
      textAlign={'center'}
      pt={10}
      justifyContent={'center'}
      direction={'column'}
      width={'full'}
    >
      <Box width={{ base: 'full', sm: 'lg', lg: 'xl' }} margin={'auto'}>
        <chakra.h1 py={5} fontSize={48} fontWeight={'bold'} color={'gray.700'}>
          Mis proyectos
        </chakra.h1>
        <chakra.h2
          margin={'auto'}
          width={'70%'}
          fontWeight={'medium'}
          color={'gray.500'}
        >
          Aquí puedes ver algunos de mis proyectos personales, puedes ver más en
          mi perfil de{' '}
          <Link
            href="https://github.com/JorgeMayoral"
            textDecoration="underline"
            isExternal
          >
            Github
          </Link>
          .
        </chakra.h2>
      </Box>
      <SimpleGrid
        columns={{ base: 1, xl: 2 }}
        spacing={'20'}
        mt={16}
        mx={'auto'}
      >
        {myProjects.map((cardInfo, index) => (
          <ProjectCard {...cardInfo} key={index} />
        ))}
      </SimpleGrid>
    </Flex>
  );
};

export default Projects;
