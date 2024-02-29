import Font from "@/components/Font"
import { Box, Button, Flex, FormLabel, Grid, Heading, Input, Image, SimpleGrid, Spacer, Text, useToast, VStack } from "@chakra-ui/react"
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
    const [location, setLocation] = useLocation();
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
            {({ values, isValid, errors, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                <>
                    <Form>
                        <FormLabel>
                            <Text as="sub" lineHeight="1" textAlign="left" fontSize="10px" color="#fff6">
                                Username / ชื่อผู้ใช้
                            </Text>
                        </FormLabel>
                        <Field fontSize="14px" type="username" color="#fff" bg="#ffffff1a" borderColor="#00000000" _hover={{ borderColor: "#00000000" }} as={Input} outline="0" name="username" placeholder={t("enter_username")} />
                        {errors.username && "username"}
                        <FormLabel>
                            <Text as="sub" lineHeight="1" textAlign="left" fontSize="10px" color="#fff6">
                                Password / รหัสผ่าน
                            </Text>
                        </FormLabel>
                        <Field fontSize="14px" type="password" color="#fff" bg="#ffffff1a" borderColor="#00000000" _hover={{ borderColor: "#00000000" }} as={Input} name="password" placeholder={t("enter_password")} />
                        {errors.password && "password"}
                        <FormLabel>
                            <Text mt="2" color="#fff6" fontSize="10px" textAlign="left">
                                {t("forgot_password")} <Box as='a' ml="1" fontSize="10px" href='https://line.me/ti/p/K1js-t_ZXk' fontWeight='900'>คลิก</Box>
                            </Text>
                        </FormLabel>
                        <Button bg="#ffffff1a" _hover={{ bg: "#fff3", border: "0", borderColor: "#fff3" }} fontWeight="400" color="#fff" disabled={!isValid} isLoading={isSubmitting} type="submit" w="100%">{t("continue")}</Button>
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
            <Flex bg="#000" bgImg="linear-gradient(0deg, rgb(59 130 246 / 10%) 0%, rgba(59, 130, 246, 0) 40%, rgba(59, 130, 246, 0) 60%, rgba(59, 130, 246, 0.1) 100%)" zIndex="-1" justifyContent="center" direction="row" alignItems="center" w="100%" h="100vh">
                <Font />
                <Box
                    w="100%"
                    h="100%"
                    alignItems="center"
                    justifyContent="center"
                    display="flex"
                >
                    <Grid
                        templateColumns={["300px", "350px"]}
                        gap={4}
                        textAlign="center"
                        p={["10px", "50px"]}
                    >
                        <Flex direction="column" justifyContent="start" alignItems="start" fontSize="2.8rem" fontWeight="900">
                            <Box lineHeight="1" py="2" bgGradient='linear(#bae6fd 0% ,#3b82f6 100%)' bgClip="text">SignIn</Box>
                            <Flex lineHeight="1" pt="1">
                                <Text fontSize="0.7rem" color='#fff6' mr="2">{t("need_account")}</Text>
                                <Box as='a' fontSize="0.7rem" bgGradient='linear(#bae6fd 0% ,#3b82f6 100%)' bgClip="text" href='https://line.me/ti/p/K1js-t_ZXk' fontWeight='bold'>
                                    Add Line
                                </Box>
                            </Flex>
                        </Flex>
                        <LoginForm />
                    </Grid>
                </Box>
            </Flex>
            <Footer/>
        </>
    )
}

export default Signin