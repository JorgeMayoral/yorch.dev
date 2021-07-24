import { Box } from '@chakra-ui/layout';

const Wrapper = ({ children }) => {
  return (
    <Box px={4} pb={8}>
      {children}
    </Box>
  );
};

export default Wrapper;
