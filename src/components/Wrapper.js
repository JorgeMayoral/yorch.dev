import { Box } from '@chakra-ui/layout';

const Wrapper = ({ children }) => {
  return (
    <Box mt={8} mx="auto" maxWidth="2xl" textAlign="left" px={4} pb={8}>
      {children}
    </Box>
  );
};

export default Wrapper;
