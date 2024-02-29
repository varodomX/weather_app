import Font from "@/components/Font";
import {
  Box,
  Input,
  SimpleGrid,
  Button,
  VStack,
  Heading,
  Select,
  Flex,
  Container,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  UnorderedList,
  ListItem,
  Img,
} from "@chakra-ui/react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useLocation } from "wouter";

AOS.init();

const App = () => {
  return (
    <>
      <Font />
      <Flex h="100vh" direction="column"  justifyContent="center" alignItems="center" bgImg="linear-gradient(90deg, rgba(59,130,246,.4),rgba(59,130,246,0))">
        <Container maxW='1280px' zIndex="0" >
            <Box fontWeight="900" fontSize="3.75rem" lineHeight="1" py="4"  bgGradient='linear(#bae6fd 0% ,#3b82f6 100%)' bgClip="text">ไม่พบหน้านี้</Box>
            <Box color="#fff" lineHeight="2.5rem" fontSize="2.25rem">Not Found page.</Box>
        </Container>
      </Flex>
    </>
  );
};

export default App;
