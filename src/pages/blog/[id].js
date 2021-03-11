import { Text } from '@chakra-ui/layout';
import { Box } from '@chakra-ui/layout';
import { Heading } from '@chakra-ui/layout';
import Layout from '../../components/Layout';
import { getAllPostsIds, getPostData } from '../../lib/posts';
import Head from 'next/head';
import ReactMarkdown from 'react-markdown';

const Post = ({ postData }) => {
  return (
    <Layout>
      <Head>
        <title>{postData.title} | DevYorch Blog</title>
      </Head>
      <Box className="markdown-body" textAlign="left" mb={10}>
        <ReactMarkdown children={postData.content} />
      </Box>
    </Layout>
  );
};

export async function getStaticPaths() {
  const paths = getAllPostsIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}

export default Post;
