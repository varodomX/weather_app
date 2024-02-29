import Font from "@/components/Font";
import {
  Box,
  Flex,
  Container,
  Spacer,
} from "@chakra-ui/react";
import { useLocation } from "wouter";

const App = () => {
  const [, setLocation] = useLocation();
  return (
    <>
      <Flex bg="#ffffff0d">
        <Container py="4" maxW='1280px' zIndex="0">
          <Flex justifyContent="center" alignItems="center" direction={["column","column","row","row","row","row"]}>
            <Flex direction="column" justifyContent='center' alignContent='center' mb={["4","4","0","0","0","0"]}>
              <Box fontSize="12px">
                ช่องทางการติดต่อ
              </Box>
              <Flex color="#fff6" fontSize="13px" direction="column" justifyContent='center' alignItems={['center','center','start','start','start','start']}>
                <Box as="a" textDecorationLine="underline" lineHeight="1" mt="1" href="https://www.facebook.com/varodom2011/">ติดต่อสอบถาม</Box>
                <Box as="a" textDecorationLine="underline" lineHeight="1" mt="1" href="https://www.facebook.com/varodom2011/">ติดต่อทำเว็บไซต์</Box>
              </Flex>
            </Flex>
            <Spacer />
            <Flex direction="column" justifyContent='center' alignContent='center'>
              <Flex fontSize='.875rem' justifyContent="center" alignItems="end">
                <Box fontSize='0.9rem' mr="1">© 2022 - 2023</Box> varodom.com
              </Flex>
              <Flex color="#fff9" justifyContent='center' fontSize="10px">
                Product of <Box as="a" href="https://www.facebook.com/varodom2011/" color="#fff" fontWeight="900" ml="1">Varodom Srisai</Box>
              </Flex>
            </Flex>
            <Spacer />
            <Flex justifyContent="center" alignItems="center" fontSize="1.65rem" fontWeight="900" color="#3c82f6">Varodom<Box color="#fff">Srisai</Box></Flex>
          </Flex>
        </Container>
      </Flex >
    </>
  );
};

export default App;
