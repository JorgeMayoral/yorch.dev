import { Box, ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import { theme } from '../theme';
import 'github-markdown-css';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeProvider
        options={{
          useSystemColorMode: false,
        }}
      >
        <Box bgColor="#eee" minHeight="100vh">
          <Component {...pageProps} />
        </Box>
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default MyApp;
