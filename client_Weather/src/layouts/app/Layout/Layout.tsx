import Font from "@/components/Font"
import Header from "@/components/Landing/Header"
import Footer from "@/views/app/Footer";
import { Box, Button, Container } from "@chakra-ui/react"
import { useLocation } from "wouter";

function Layout(props: any) {
    const [location, setLocation] = useLocation();
    return (
        <>
            <Font />
            <Box bgImg="linear-gradient(0deg, rgb(59 130 246 / 10%) 0%, rgba(59, 130, 246, 0) 40%, rgba(59, 130, 246, 0) 60%, rgba(59, 130, 246, 0.1) 100%)" h="100%">
                <Header />
                <Container pt="100px" maxW={['100%', '100%', '100%', '100%', '80%']} zIndex="0">
                    {props.children}
                </Container>
                <Footer/>
            </Box>
        </>
    )
}

export default Layout