import Font from "@/components/Font";
import {
    Box,
    Input,
    Button,
    VStack,
    Heading,
    Select,
    Flex,
    Container,
    Text,
    Link,
    Textarea,
    SimpleGrid,
    FormControl,
    FormLabel,
    FormHelperText,
    useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Formik, Field, Form } from "formik";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from "dayjs";
import th from "dayjs/locale/th";
import html2canvas from "html2canvas";
import { useMutation } from "react-query";
import axios from "axios";

const HEIGHT = 1814;
const WIDTH = 1134;

interface InformationProp {
    token: any;
    image: any;
}

const Line = () => {
    const toast = useToast()
    const [file, setFile] = useState();
    return (
        <>
            <Formik<InformationProp>
                initialValues={{
                    token: `[{"token" : ""},{"token" : ""}]`,
                    image: null
                }}
                onSubmit={(values, { setSubmitting }) => {
                    const formData = new FormData();
                    formData.append("img", values.image)
                    formData.append("token", values.token)

                    axios.post("http://localhost:4000/v1/sending", formData).then(function (response) {
                        if (response.status == 200) {
                            toast({
                                title: `ส่งสำเร็จ`,
                                status: "success",
                                isClosable: true,
                            })
                        }
                    })

                    setSubmitting(false);
                }}
            >
                {({ values, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
                    <Box w="100%" h="100vh" zIndex="-1">
                        <Flex direction={['column', 'row', 'row', 'row', 'row']} justifyContent="center">
                            <Flex justifyContent="center" w="80%" h="100%">
                                <Flex justifyContent="center" w="80%">
                                    <img src={file} />
                                </Flex>
                            </Flex>
                            <Flex p="3" w="100%" justifyContent="center">
                                <Form style={{ width: "100%" }} encType="multipart/form-data">
                                    <VStack alignItems="start" spacing={3}>
                                        <Heading fontSize="calc(0.75em + 1.2vmin)">แก้ไขข้อมูลการส่ง Line</Heading>
                                        <FormControl>
                                            <FormLabel>แก้ไขTOKEN รูปแบบ JSON</FormLabel>
                                            <Field name="token" as={Textarea} border="1px" borderColor="#ffffff1a" _hover={{ "borderColor": "#ffffff1a" }} />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>อัพโหลดรูปภาพ</FormLabel>
                                            <Input p="1" border="1px" borderColor="#ffffff1a" id="file" name="image" type="file" onChange={(event) => {
                                                //setFieldValue("image", event.currentTarget.files[0]);
                                                //setFile(URL.createObjectURL(event.target.files[0]))
                                            }} />
                                        </FormControl>
                                        <Button
                                            isLoading={isSubmitting}
                                            type="submit"
                                            bg="#ffffff1a"
                                            _hover={{ bg: "#fff3", border: "0", borderColor: "#fff3" }}
                                            fontWeight="400"
                                            color="#fff"
                                        >
                                            ส่งline
                                        </Button>
                                    </VStack>
                                </Form>
                            </Flex>
                        </Flex>
                    </Box>
                )}
            </Formik>
        </>
    );
};

export default Line;
