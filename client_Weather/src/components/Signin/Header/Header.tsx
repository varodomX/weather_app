import { Box, Container, Flex, Spacer } from "@chakra-ui/react"
import ChangeLanguage from "../../ChangeLanguage/ChangeLanguage";

function Header() {
    return (
        <Box backdropFilter="blur(12px)" position="fixed" w="100%" p="4" h="75px" zIndex="1">
            <Container maxW='1280px' zIndex="0">
                <Flex direction="row" alignItems="center">
                    <Flex justifyContent="center" alignItems="center" fontSize="1.65rem" fontWeight="900" color="#3c82f6">Zl<Box color="#fff">ip</Box></Flex>
                    <Spacer />
                    <ChangeLanguage />
                </Flex>
            </Container>
        </Box>
    )
}

export default Header