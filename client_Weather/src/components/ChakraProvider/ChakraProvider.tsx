import theme from "./theme";
import { ChakraProvider as Provider } from "@chakra-ui/react";

function ChakraProvider(props: any) {
  return <Provider theme={theme}>{props.children}</Provider>;
}

export default ChakraProvider;
