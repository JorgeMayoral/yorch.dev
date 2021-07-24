import { Box } from '@chakra-ui/layout';
import Navbar from './Navbar';
import Wrapper from './Wrapper';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <Box>
      <Navbar />
      <Wrapper>{children}</Wrapper>
      <Footer />
    </Box>
  );
};

export default Layout;
