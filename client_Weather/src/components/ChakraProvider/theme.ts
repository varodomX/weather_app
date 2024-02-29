import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  initialColorMode: 'dark',
  fonts: {
    heading: `'Kanit', sans-serif`,
    body: `'Kanit', sans-serif`,
  },
  styles: {
    global: {
      'html, body': {
        color:"#fff",
        bg:"#000"
      }
    }
  }
});

export default theme;
