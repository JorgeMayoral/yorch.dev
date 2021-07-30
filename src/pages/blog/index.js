import { Heading, VStack } from '@chakra-ui/layout';
import Layout from '../../components/Layout';
import PostCard from '../../components/PostCard';
import { getSortedPostsData } from '../../lib/posts';
import Head from 'next/head';
import { Container } from '@chakra-ui/react';

const Blog = ({ allPostsData }) => {
  return (
    <Layout>
      <Head>
        <title>Blog | DevYorch</title>
      </Head>
      <Container maxW={'7xl'} p="12">
        <Heading mb={4}>Blog</Heading>
        <VStack spacing={4}>
          {allPostsData.map((p) => (
            <PostCard
              title={p.title}
              extract={p.extract}
              key={p.id}
              date={p.date}
              id={p.id}
            />
          ))}
        </VStack>
      </Container>
    </Layout>
  );
};

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default Blog;
