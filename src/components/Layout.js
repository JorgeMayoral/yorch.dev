import { Box } from '@chakra-ui/layout';
import Navbar from './Navbar';
import Wrapper from './Wrapper';

const Layout = ({ children }) => {
  return (
    <Box>
      <Navbar />
      <Wrapper>{children}</Wrapper>
    </Box>
  );
};

export default Layout;
