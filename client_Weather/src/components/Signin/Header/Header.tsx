import { Box, Container, Flex, Spacer } from "@chakra-ui/react"
import ChangeLanguage from "../../ChangeLanguage/ChangeLanguage";
import { useLocation } from "wouter";

function Header() {
    const [, setLocation] = useLocation();
    return (
        <Box backdropFilter="blur(14px)" bg="rgba(5,10,20,0.55)" borderBottom="1px solid rgba(120,180,255,0.12)" position="fixed" w="100%" p="4" h="75px" zIndex="1">
            <Container maxW='1280px' zIndex="0">
                <Flex direction="row" alignItems="center">
                    <Flex justifyContent="center" alignItems="center" fontSize="1.65rem" fontWeight="900" color="#60a5fa" _hover={{ cursor: "pointer" }} onClick={() => setLocation("/")}>
                        UNE<Box color="#fff">WORK</Box>
                    </Flex>
                    <Spacer />
                    <ChangeLanguage />
                </Flex>
            </Container>
        </Box>
    )
}

export default Header
