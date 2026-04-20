import Font from "@/components/Font";
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Input,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
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

  const signIn = (values: InformationProp) => {
    const username = values.username.trim();
    const password = values.password.trim();

    if (username === "admin" && password === "1234") {
      toast({
        title: "เข้าสู่ระบบสำเร็จ",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      localStorage.setItem("token", "local-admin-token");
      localStorage.setItem("auth-name", username);
      setLocation("/");
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("auth-name");
    toast({
      title: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
      description: "ใช้ username: admin และ password: 1234",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Formik<InformationProp>
      initialValues={{
        username: "",
        password: "",
      }}
      validate={(values) => {
        if (!values.username) {
          return { username: "required" };
        }

        if (!values.password) {
          return { password: "required" };
        }
      }}
      onSubmit={(values, { setSubmitting }) => {
        signIn(values);
        setSubmitting(false);
      }}
    >
      {({ errors, isValid, isSubmitting }) => (
        <Form>
          <VStack spacing={4} alignItems="stretch">
            <Box>
              <FormLabel mb="1">
                <Text fontSize="12px" color="#cfe2ff">
                  Username / ชื่อผู้ใช้
                </Text>
              </FormLabel>
              <Field
                as={Input}
                name="username"
                type="text"
                placeholder={t("enter_username")}
                h="52px"
                borderRadius="16px"
                bg="rgba(255,255,255,0.06)"
                color="#fff"
                border="1px solid rgba(96,165,250,0.25)"
                _hover={{ borderColor: "rgba(96,165,250,0.4)" }}
                _focusVisible={{
                  borderColor: "#60a5fa",
                  boxShadow: "0 0 0 1px #60a5fa",
                }}
              />
              {errors.username && (
                <Text mt="1" fontSize="11px" color="#fca5a5">
                  กรุณากรอกชื่อผู้ใช้
                </Text>
              )}
            </Box>

            <Box>
              <FormLabel mb="1">
                <Text fontSize="12px" color="#cfe2ff">
                  Password / รหัสผ่าน
                </Text>
              </FormLabel>
              <Field
                as={Input}
                name="password"
                type="password"
                placeholder={t("enter_password")}
                h="52px"
                borderRadius="16px"
                bg="rgba(255,255,255,0.06)"
                color="#fff"
                border="1px solid rgba(96,165,250,0.25)"
                _hover={{ borderColor: "rgba(96,165,250,0.4)" }}
                _focusVisible={{
                  borderColor: "#60a5fa",
                  boxShadow: "0 0 0 1px #60a5fa",
                }}
              />
              {errors.password && (
                <Text mt="1" fontSize="11px" color="#fca5a5">
                  กรุณากรอกรหัสผ่าน
                </Text>
              )}
            </Box>

            <Text color="#cbd5e1" fontSize="12px">
              ลืมรหัสผ่าน?{" "}
              <Box
                as="a"
                href="https://line.me/ti/p/K1js-t_ZXk"
                color="#60a5fa"
                fontWeight="700"
              >
                ติดต่อผู้ดูแล
              </Box>
            </Text>

            <Button
              type="submit"
              h="52px"
              borderRadius="16px"
              bg="#2563eb"
              color="#fff"
              fontWeight="700"
              _hover={{ bg: "#1d4ed8" }}
              isLoading={isSubmitting}
              isDisabled={!isValid}
            >
              เข้าสู่ระบบ
            </Button>
          </VStack>
        </Form>
      )}
    </Formik>
  );
}

function Signin() {
  return (
    <>
      <Flex
        minH="100vh"
        bg="#050816"
        backgroundImage="radial-gradient(circle at top left, rgba(37,99,235,0.28), transparent 24%), linear-gradient(180deg, rgba(59,130,246,0.08) 0%, rgba(5,8,22,1) 50%)"
        alignItems="center"
        justifyContent="center"
        px="4"
        py="120px"
        position="relative"
        overflow="hidden"
      >
        <Font />
        <Box
          position="absolute"
          inset="0"
          opacity="0.18"
          bgImage="linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)"
          backgroundSize="32px 32px"
        />

        <Flex
          w="100%"
          maxW="440px"
          direction="column"
          gap="6"
          position="relative"
          zIndex="1"
        >
          <Box textAlign="center">
            <Text
              fontSize="14px"
              letterSpacing="0.28em"
              textTransform="uppercase"
              color="#60a5fa"
              mb="3"
            >
              UNE WORK
            </Text>
            <Text color="#fff" fontSize={["2rem", "2.4rem"]} fontWeight="900">
              Sign In
            </Text>
            <Text mt="3" color="#cbd5e1" fontSize="14px">
              เข้าสู่ระบบเพื่อใช้งาน Page1, Page2 และ Page3
            </Text>
          </Box>

          <Box
            bg="rgba(8,15,30,0.86)"
            border="1px solid rgba(96,165,250,0.18)"
            borderRadius="28px"
            p={["6", "8"]}
            boxShadow="0 24px 80px rgba(0,0,0,0.35)"
            backdropFilter="blur(18px)"
          >
            <LoginForm />
          </Box>
        </Flex>
      </Flex>
      <Footer />
    </>
  );
}

export default Signin;
