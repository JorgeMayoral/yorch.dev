import { Box, Heading, Link, Stack, Text, VStack } from '@chakra-ui/layout';
import { Button, Divider, Image } from '@chakra-ui/react';
import { FaGithub, FaGooglePlay } from 'react-icons/fa';
import Layout from './../components/Layout';
import AboutMe from './../components/AboutMe';
import Projects from '../components/Projects';
import Head from 'next/head';

const Index = () => (
  <>
    <Layout>
      <AboutMe />
      <Projects />
      <Head>
        <title>DevYorch</title>
      </Head>
    </Layout>
  </>
);

export default Index;
