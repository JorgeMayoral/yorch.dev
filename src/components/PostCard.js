import { Box, Heading, Link, Text } from '@chakra-ui/layout';
import NextLink from 'next/link';

const PostCard = ({ title, date, id, extract }) => {
  return (
    <NextLink href="/blog/[id]" as={`/blog/${id}`}>
      <Box
        bgColor="#fefefe"
        p={4}
        borderRadius="1em"
        boxShadow="md"
        textAlign="left"
        width="100%"
        _hover={{
          cursor: 'pointer',
          bgColor: '#f3f3f3',
        }}
      >
        <Link
          _hover={{
            textDecoration: 'none',
          }}
        >
          <Heading>{title}</Heading>
        </Link>
        <Text>{extract}</Text>
        <Text color="gray.400" fontSize="xs" textAlign="right">
          {date}
        </Text>
      </Box>
    </NextLink>
  );
};

export default PostCard;
