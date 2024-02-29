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
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Formik, Field, Form } from "formik";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from "dayjs";
import th from "dayjs/locale/th";
import html2canvas from "html2canvas";

const HEIGHT = 1814;
const WIDTH = 1134;

interface InformationProp {
    description: string;
    description_position: number;
    description_fontsize: string;
    description_lineheight: string;
    wind_direction: string;
    wind_speed: string;
    date: string;
    weather: "w1" | "w2" | "w3" | "w4" | "w5" | "w6";
}

const Page2 = () => {
    return (
        <>
            <Formik<InformationProp>
                initialValues={{
                    description: `มีฝนฟ้าคะนอง ร้อยละ30 ของพื้นที่\nส่วนมากบริเวณจังหวัดหนองคาย บึงกาฬ อุดรธานี สกลนคร นครพนม\nขอนแก่น ชัยภูมิ นครราชสีมา บุรีร์มย์ สรินทร์ ศรีสะเกษ และอุบลราชธานี\nอุณหภูมิต่ำสุด 24 - 26 องศาเซลเซียส\nอุณหภูมิต่ำสุด 34 - 36 องศาเซลเซียส `,
                    description_position: 1485,
                    description_fontsize: "2",
                    description_lineheight: "42",
                    wind_direction: "ลมตะวันออกเฉียงใต้",
                    wind_speed: "ความเร็วลม\n10 - 20 กม./ชม",
                    weather: "w1",
                    date: Date()
                }}
                onSubmit={(values, { setSubmitting }) => {
                    const slip = document.querySelector<HTMLCanvasElement>("#slip");

                    if (slip) {
                        const link = document.createElement("a");

                        const url = slip.toDataURL();

                        link.download = "page1.jpg";
                        link.href = url;
                        document.body.appendChild(link);
                        // link.click();
                        // document.body.removeChild(link);


                        setSubmitting(false);
                    }
                }}
            >
                {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                    <Box w="100%" h="100%" zIndex="-1">
                        <Flex direction={['column', 'row', 'row', 'row', 'row']} justifyContent="center">
                            <Flex justifyContent="center">
                                <NewSlip {...values} />
                            </Flex>
                            <Flex p="3" w={['100%', '100%', '50%', '50%', '50%']} justifyContent="center">
                                <Form style={{ width: "100%" }}>
                                    <VStack alignItems="start" spacing={3}>
                                        <Heading fontSize="calc(0.75em + 1.2vmin)">แก้ไขข้อมูล</Heading>
                                        <Field as={Input} type="datetime-local" name="date" border="1px" borderColor="#ffffff1a" />
                                        {/* <Field as={Textarea} name="description" border="1px" borderColor="#ffffff1a" />
                                        <SimpleGrid columns={[1, 2, 2, 2]} spacing={2}>
                                            <FormControl>
                                                <FormLabel fontSize="12px">Fontsize (ขนาดฟอนต์)</FormLabel>
                                                <Field as={Input} type="number" name="description_fontsize" border="1px" borderColor="#ffffff1a" />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel fontSize="12px">Lineheight (ระยะห่างระหว่างบรรทัด)</FormLabel>
                                                <Field as={Input} type="number" name="description_lineheight" border="1px" borderColor="#ffffff1a" />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel fontSize="12px">Height Position (ตำแหน่งความสูง)</FormLabel>
                                                <Field as={Input} type="number" name="description_position" border="1px" borderColor="#ffffff1a" />
                                            </FormControl>
                                        </SimpleGrid>
                                        <Select
                                            name="weather"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            border="1px"
                                            borderColor="#ffffff1a"
                                        >
                                            <option value="w1" label="เลือกสภาพอากาศ" >
                                                เลือกสภาพอากาศ
                                            </option>
                                            <option value="w1">
                                                มีเมฆเต็มท้องฟ้า
                                            </option>
                                            <option value="w2">
                                                ท้องฟ้าแจ่มใส่
                                            </option>
                                            <option value="w3">
                                                ท้องฟ้าโปร่ง
                                            </option>
                                            <option value="w4">
                                                มีเมฆเป็นส่วนมาก
                                            </option>
                                            <option value="w5">
                                                มีเมฆบางส่วน
                                            </option>
                                            <option value="w6">
                                                มีเมฆมาก
                                            </option>
                                        </Select>
                                        <Field as={Input} name="wind_direction" border="1px" borderColor="#ffffff1a" />
                                        <Field as={Textarea} name="wind_speed" border="1px" borderColor="#ffffff1a" /> */}

                                        {/* <Button
                                            isLoading={isSubmitting}
                                            type="submit"
                                            bg="#ffffff1a"
                                            _hover={{ bg: "#fff3", border: "0", borderColor: "#fff3" }}
                                            fontWeight="400"
                                            color="#fff"
                                        >
                                            Save Image
                                        </Button> */}
                                        <Box fontSize="12px">วิธีโหลดรูป! คลิกขวา Save Image as</Box>
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

const NewSlip = (props: InformationProp) => {
    const ref = useRef<HTMLCanvasElement>(null);
    const [assets, setAssets] = useState<{
        bg: ImageBitmap;
    } | null>(null);

    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault('Asia/Bangkok');
    dayjs.locale(th)

    useEffect(() => {
        const fetchToBitmap = (url: string) =>
            fetch(url)
                .then((r) => r.blob())
                .then((b) => createImageBitmap(b));

        const gettingImage = async () => {
            const [bg] = await Promise.all([
                fetchToBitmap(`${import.meta.env.VITE_API_ASSETS}bg2.jpg`),
            ]);

            setAssets({
                bg,
            });
        };

        gettingImage();
    }, []);

    useEffect(() => {
        const canvas = ref.current;
        const ctx = canvas?.getContext("2d");

        if (ctx && canvas && assets) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#3e3e3e";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(assets.bg, 0, 0, canvas.width, canvas.height);
            ctx.font = "bold 1.9em Kanit";

            ctx.textAlign = "left";
            ctx.lineWidth = 6;
            ctx.shadowColor = "#00000066";
            // ctx.fillText(dayjs(props.date).format("วันที่ DD MMMM YYYY เวลา HH:mm น."), WIDTH / 2 - 120, 185);
            ctx.fillStyle = "#8d5018";
            // ctx.strokeText(dayjs(props.date).format("วันที่ DD MMMM YYYY เวลา HH:mm น."), WIDTH / 2 - 120, 185);
            ctx.fillText(dayjs(props.date).format("วันที่ DD MMMM YYYY เวลา HH:mm น."), WIDTH / 2 - 120, 185);

            ctx.shadowBlur = 0;

            ctx.textAlign = "center";
            ctx.font = `${props.description_fontsize}em Kanit`;
            ctx.fillStyle = "black";

            // const { width: fromWidth } = ctx.measureText(props.from);
            // ctx.drawImage(assets.siamCommercial, WIDTH - fromWidth - 45 - 40 - 15, 470, 40, 40);
            // ctx.fillText(props.description, WIDTH - 550, 1460);

            var img = new Image;
            img.src = "https://weather.tmd.go.th/kkn/kkn240_latest.gif";
            img.onload = function () {
                ctx.drawImage(img,
                    0,5,
                    890, 800,
                    140, 248.5,
                    1058, 800);
            };

            // ctx.fillText(props.to, WIDTH - 45, 625);

            // ctx.fillText(props.amount, WIDTH - 48, 817);

            // ctx.font = "1.4em Kanit";
            // ctx.fillStyle = "#717075";
            // ctx.fillText(props.accountIdFrom, WIDTH - 45, 538);
            // ctx.fillText(props.accountIdTo, WIDTH - 45, 663);

            // const qrcode = new Image();
            // qrcode.src = props.qrcode
            // qrcode.onload = function () {
            //     ctx.drawImage(qrcode, WIDTH - 65 - 38 - 115, 900, 170, 170);
            // }
        }
    }, [props, assets]);

    return (
        <Flex h="100vh" w={['100%', '100%', '70%', '60%', '60%']} alignItems="center" justifyContent={["center", "center", "start", "start"]} direction="column">
            <Font />
            <canvas
                id="slip"
                height={HEIGHT}
                width={WIDTH}
                style={{ width: "100%" }}
                ref={ref}
            />
        </Flex>
    );
};

export default Page2;
