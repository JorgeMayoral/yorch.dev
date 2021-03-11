import { Heading, VStack } from '@chakra-ui/layout';
import Layout from '../../components/Layout';
import PostCard from '../../components/PostCard';
import { getSortedPostsData } from '../../lib/posts';
import Head from 'next/head';

const Blog = ({ allPostsData }) => {
  return (
    <Layout>
      <Head>
        <title>Blog | DevYorch</title>
      </Head>
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
