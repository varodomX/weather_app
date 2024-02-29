import { Button, Flex } from "@chakra-ui/react"
import i18n from "../I18nextProvider/I18n";
import { useTranslation } from 'react-i18next';

function ChangeLanguage() {
    const { t, i18n } = useTranslation();
    return (
        <>
            <Flex gap="2">
                {i18n.language !== "en" ? (
                    <Button
                        fontSize="15"
                        w="100%"
                        bg="#ffffff1a" 
                        _hover={{ bg: "#fff3", border: "0", borderColor: "#fff3" }} 
                        fontWeight="400" 
                        color="#fff" 
                        onClick={() => { i18n.changeLanguage('en') }}
                    >
                        English
                    </Button>
                ) : (
                    <Button
                        fontSize="15"
                        bg="#ffffff1a" 
                        _hover={{ bg: "#fff3", border: "0", borderColor: "#fff3" }} 
                        fontWeight="400" 
                        color="#fff"
                        w="100%"
                        onClick={() => { i18n.changeLanguage('th') }}
                    >
                        ภาษาไทย
                    </Button>
                )
                }
            </Flex>
        </>
    )
}

export default ChangeLanguage