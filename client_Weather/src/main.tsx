import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ChakraProvider from "./components/ChakraProvider";
import { QueryClient, QueryClientProvider } from 'react-query'
import I18nextProvider from "./components/I18nextProvider";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ColorModeScript } from "@chakra-ui/react";

AOS.init({
  startEvent: 'load',
  initClassName: 'aos-init'
});

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <I18nextProvider>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
        <ColorModeScript initialColorMode={"dark"} />
          <App />
        </ChakraProvider>
      </QueryClientProvider>
    </I18nextProvider>
  </React.StrictMode>
);
