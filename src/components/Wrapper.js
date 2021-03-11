import { Box } from '@chakra-ui/layout';

const Wrapper = ({ children }) => {
  return (
    <Box mt={8} mx="auto" maxWidth="60em" textAlign="left" p="1em">
      {children}
    </Box>
  );
};

export default Wrapper;
