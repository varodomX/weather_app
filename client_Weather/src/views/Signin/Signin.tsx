import Font from "@/components/Font"
import { Box, Button, Flex, FormLabel, Grid, Input, Text, useToast, VStack } from "@chakra-ui/react"
import { Field, Form, Formik } from "formik";
import { useMutation } from "react-query";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import Footer from "../app/Footer";

interface InformationProp {
    username: string;
    password: string;
}

function LoginForm() {
    const { t } = useTranslation();
    const [, setLocation] = useLocation();
    const toast = useToast();

    const { mutate } = useMutation(async (info: InformationProp) => {
        const opt = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: info.username,
                password: info.password,
            }),
        };
        const login = await fetch(import.meta.env.VITE_API_URL + "signIn", opt).then(
            (res) => res.json()
        );
        return login;
    }, {
        onSuccess: (data) => {
            if (data.status === "success") {
                toast({
                    title: "เข้าสู่ระบบสำเร็จ",
                    description: "",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
                localStorage.setItem("token", data.data.jwt);
                setLocation("/");
            } else {
                toast({
                    title: data.data[0].msg || data.data,
                    description: "",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                });
            }
        },
    })
    return (
        <Formik<InformationProp>
            // isInitialValid={false}
            validate={(values) => {
                if (values.username === "") {
                    return { username: "" }
                } else if (values.password === "") {
                    return { password: "" }
                }
            }}
            initialValues={{
                username: "",
                password: "",
            }}
            onSubmit={(values, { setSubmitting }) => {
                mutate({ username: values.username, password: values.password })
                setSubmitting(false);
            }
            }
        >
            {({ isValid, errors, isSubmitting }) => (
                <>
                    <Form>
                        <VStack spacing={4} alignItems="stretch">
                            <Box>
                                <FormLabel mb="1">
                                    <Text as="sub" lineHeight="1" textAlign="left" fontSize="11px" color="#d8ecff">
                                        Username / ชื่อผู้ใช้
                                    </Text>
                                </FormLabel>
                                <Field
                                    fontSize="15px"
                                    type="username"
                                    color="#fff"
                                    bg="rgba(255,255,255,0.08)"
                                    border="1px solid rgba(120,180,255,0.22)"
                                    _hover={{ borderColor: "rgba(120,180,255,0.4)" }}
                                    _focusVisible={{ borderColor: "#5da8ff", boxShadow: "0 0 0 1px #5da8ff" }}
                                    as={Input}
                                    outline="0"
                                    name="username"
                                    placeholder={t("enter_username")}
                                    h="50px"
                                    borderRadius="16px"
                                />
                                {errors.username && <Text mt="1" fontSize="11px" color="#ffb4b4">กรุณากรอกชื่อผู้ใช้</Text>}
                            </Box>
                            <Box>
                                <FormLabel mb="1">
                                    <Text as="sub" lineHeight="1" textAlign="left" fontSize="11px" color="#d8ecff">
                                        Password / รหัสผ่าน
                                    </Text>
                                </FormLabel>
                                <Field
                                    fontSize="15px"
                                    type="password"
                                    color="#fff"
                                    bg="rgba(255,255,255,0.08)"
                                    border="1px solid rgba(120,180,255,0.22)"
                                    _hover={{ borderColor: "rgba(120,180,255,0.4)" }}
                                    _focusVisible={{ borderColor: "#5da8ff", boxShadow: "0 0 0 1px #5da8ff" }}
                                    as={Input}
                                    name="password"
                                    placeholder={t("enter_password")}
                                    h="50px"
                                    borderRadius="16px"
                                />
                                {errors.password && <Text mt="1" fontSize="11px" color="#ffb4b4">กรุณากรอกรหัสผ่าน</Text>}
                            </Box>
                            <Text color="#c9d8ea" fontSize="12px" textAlign="left">
                                {t("forgot_password")} <Box as='a' ml="1" color="#8bc2ff" href='https://line.me/ti/p/K1js-t_ZXk' fontWeight='900'>คลิก</Box>
                            </Text>
                            <Button
                                bg="linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)"
                                _hover={{ bg: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)" }}
                                fontWeight="700"
                                color="#fff"
                                disabled={!isValid}
                                isLoading={isSubmitting}
                                type="submit"
                                w="100%"
                                h="52px"
                                borderRadius="16px"
                                boxShadow="0 14px 30px rgba(37,99,235,0.25)"
                            >
                                {t("continue")}
                            </Button>
                        </VStack>
                    </Form>
                </>
            )
            }
        </Formik >
    )
}

function Signin() {
    const { t } = useTranslation();
    return (
        <>
            <Flex
                bg="#050a14"
                backgroundImage="radial-gradient(circle at top left, rgba(59,130,246,0.28), transparent 28%), radial-gradient(circle at top right, rgba(125,211,252,0.22), transparent 22%), linear-gradient(180deg, rgba(59,130,246,0.08) 0%, rgba(5,10,20,0.98) 42%)"
                zIndex="-1"
                justifyContent="center"
                direction="row"
                alignItems="center"
                w="100%"
                minH="100vh"
                px={4}
                py="120px"
                position="relative"
                overflow="hidden"
            >
                <Font />
                <Box position="absolute" inset="0" opacity="0.25" bgImage="linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)" backgroundSize="32px 32px" />
                <Box
                    w="100%"
                    maxW="1120px"
                    alignItems="center"
                    justifyContent="center"
                    display="flex"
                    position="relative"
                    zIndex="1"
                >
                    <Grid
                        templateColumns={["1fr", "1fr", "1.05fr 0.95fr"]}
                        gap={[6, 8, 10]}
                        textAlign="center"
                        p={[2, 4]}
                        w="100%"
                        alignItems="stretch"
                    >
                        <Flex
                            direction="column"
                            justifyContent="space-between"
                            alignItems="start"
                            textAlign="left"
                            bg="rgba(255,255,255,0.04)"
                            border="1px solid rgba(130,180,255,0.14)"
                            borderRadius="28px"
                            p={[6, 8, 10]}
                            backdropFilter="blur(18px)"
                            boxShadow="0 28px 80px rgba(0,0,0,0.28)"
                            minH="420px"
                        >
                            <Box>
                                <Text fontSize="12px" letterSpacing="0.24em" textTransform="uppercase" color="#93c5fd" mb="4">
                                    UNE WORK
                                </Text>
                                <Box lineHeight="0.95" py="2" color="#fff" fontSize={["2.4rem", "3rem", "3.6rem"]} fontWeight="900">
                                    เข้าสู่ระบบ
                                </Box>
                                <Text mt="4" color="#d6e3f2" fontSize={["14px", "15px", "16px"]} maxW="440px" lineHeight="1.8">
                                    ใช้งานเครื่องมือสร้างภาพสภาพอากาศในโทนเดียวกับระบบหลัก จัดการงานได้ต่อเนื่องและรวดเร็วในที่เดียว
                                </Text>
                            </Box>
                            <VStack alignItems="start" spacing={3} mt={8}>
                                <Text color="#fff" fontWeight="700">สิ่งที่คุณจะได้หลังเข้าสู่ระบบ</Text>
                                <Text color="#c7d7ea" fontSize="14px">จัดการหน้า `Page1`, `Page2`, `Page3` ได้ใน workflow เดียวกัน</Text>
                                <Text color="#c7d7ea" fontSize="14px">สร้างภาพประกอบสภาพอากาศด้วยหน้าตาและรูปแบบที่สอดคล้องกัน</Text>
                                <Text color="#c7d7ea" fontSize="14px">ขอสิทธิ์เข้าใช้งานเพิ่มเติมผ่าน Line ได้ทันที</Text>
                            </VStack>
                        </Flex>
                        <Box
                            bg="rgba(10,16,28,0.78)"
                            border="1px solid rgba(120,180,255,0.18)"
                            borderRadius="28px"
                            p={[6, 7, 8]}
                            backdropFilter="blur(18px)"
                            boxShadow="0 28px 80px rgba(0,0,0,0.34)"
                        >
                            <VStack spacing={6} alignItems="stretch">
                                <Box textAlign="left">
                                    <Text color="#fff" fontSize="30px" fontWeight="900" lineHeight="1">
                                        Sign In
                                    </Text>
                                    <Text mt="2" color="#c9d8ea" fontSize="14px">
                                        {t("need_account")}{" "}
                                        <Box as='a' color="#8bc2ff" href='https://line.me/ti/p/K1js-t_ZXk' fontWeight='700'>
                                            Add Line
                                        </Box>
                                    </Text>
                                </Box>
                                <LoginForm />
                            </VStack>
                        </Box>
                    </Grid>
                </Box>
            </Flex>
            <Footer/>
        </>
    )
}

export default Signin
