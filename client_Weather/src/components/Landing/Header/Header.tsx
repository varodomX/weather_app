import { Box, Container, Flex, IconButton, Image, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spacer, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react"
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { HamburgerIcon } from '@chakra-ui/icons'

function Header() {
    const [location, setLocation] = useLocation();
    const [time, setTime] = useState(dayjs());
    return (
        <Box backdropFilter="blur(12px)" position="fixed" w="100%" zIndex="1">
            <Container maxW='1280px' zIndex="0">
                <Flex direction="row" alignItems="center" p="4">
                    <Flex direction="row" alignItems="center" _hover={{cursor: "pointer"}} onClick={() => {
                        setLocation("/");
                    }}>
                        <Flex justifyContent="center" alignItems="center" fontSize="1.65rem" fontWeight="900" color="#3c82f6">ส่วนติดตาม<Box color="#fff">สภาวะอากาศ</Box></Flex>
                    </Flex>
                    <Spacer />
                    <Box display={['block', 'none', 'none', 'none', 'none']}>
                        <Menu>
                            <MenuButton
                                as={IconButton}
                                aria-label='Options'
                                icon={<HamburgerIcon />}
                                bg="#ffffff1a"
                                _hover={{ bg: "#fff3", border: "0", borderColor: "#fff3" }}
                            />
                            <MenuList>
                                <Flex p="3" color="#000">
                                    {/* <Info /> */}
                                </Flex>
                                <MenuDivider />

                            </MenuList>
                        </Menu>
                    </Box>
                    
                </Flex>
            </Container>
        </Box >
    )
}

export default Header