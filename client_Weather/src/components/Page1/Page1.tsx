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
import { loadPageState, savePageState } from "@/lib/firebaseStore";

const HEIGHT = 1814;
const WIDTH = 1134;
const INITIAL_DATE = dayjs().format("YYYY-MM-DD");

interface InformationProp {
    description: string;
    description_position: number;
    description_fontsize: string;
    description_lineheight: string;
    wind_direction: string;
    wind_speed: string;
    time: string;
    date: string;
    weather: "w1" | "w2" | "w3" | "w4" | "w5" | "w6";
}

const getTimeSlotFromDate = (dateValue: string) => {
    const hour = dayjs(dateValue).hour();

    if (hour >= 9 && hour < 12) return "10:00 น.";
    if (hour >= 12 && hour < 15) return "13:00 น.";
    if (hour >= 15 && hour < 18) return "16:00 น.";
    if (hour >= 18 && hour < 21) return "19:00 น.";
    if (hour >= 21 && hour <= 23) return "22:00 น.";
    if (hour >= 0 && hour < 3) return "01:00 น.";
    if (hour >= 3 && hour < 6) return "04:00 น.";

    return "07:00 น.";
};

const DEFAULT_VALUES: InformationProp = {
    description: `มีฝนฟ้าคะนอง ร้อยละ30 ของพื้นที่\nส่วนมากบริเวณจังหวัดหนองคาย บึงกาฬ อุดรธานี สกลนคร นครพนม\nขอนแก่น ชัยภูมิ นครราชสีมา บุรีร์มย์ สรินทร์ ศรีสะเกษ และอุบลราชธานี\nอุณหภูมิต่ำสุด 24 - 26 องศาเซลเซียส\nอุณหภูมิต่ำสุด 34 - 36 องศาเซลเซียส `,
    description_position: 1485,
    description_fontsize: "2",
    description_lineheight: "42",
    wind_direction: "ลมตะวันออกเฉียงใต้",
    wind_speed: "ความเร็วลม\n10 - 20 กม./ชม",
    weather: "w1",
    time: getTimeSlotFromDate(INITIAL_DATE),
    date: INITIAL_DATE
};

const printAt = (context: CanvasRenderingContext2D, text: string, x: number, y: number, lineHeight: number, fitWidth: number) => {
    var lines = text.split('\n');
    fitWidth = fitWidth || 0;

    if (fitWidth <= 0) {
        context.fillText(text, x, y);
        return;
    }

    for (var idx = 1; idx <= text.length; idx++) {
        var str = text.substr(0, idx);
        if (context.measureText(str).width > fitWidth) {
            context.fillText(text.substr(0, idx - 1), x, y);
            printAt(context, text.substr(idx - 1), x, y + lineHeight, lineHeight, fitWidth);
            return;
        }
    }
    for (var i = 0; i < lines.length; i++)
        context.fillText(lines[i], x, y + (i * lineHeight));
};

const Page1 = () => {
    const [initialValues, setInitialValues] = useState<InformationProp>(DEFAULT_VALUES);
    const [uploadedSatelliteImage, setUploadedSatelliteImage] = useState("");
    const [isLoadingSatelliteImage, setIsLoadingSatelliteImage] = useState(false);
    const toast = useToast();

    useEffect(() => {
        const syncSavedValues = async () => {
            try {
                const savedValues = await loadPageState<InformationProp>("page1");

                if (savedValues) {
                    setInitialValues({ ...DEFAULT_VALUES, ...savedValues });
                }
            } catch (error) {
                console.error("Failed to load page1 state", error);
            }
        };

        syncSavedValues();
    }, []);

    useEffect(() => {
        return () => {
            if (uploadedSatelliteImage) {
                URL.revokeObjectURL(uploadedSatelliteImage);
            }
        };
    }, [uploadedSatelliteImage]);

    const loadSatelliteImage = async () => {
        setIsLoadingSatelliteImage(true);

        try {
            const response = await fetch(`/.netlify/functions/satellite-image?t=${Date.now()}`);

            if (!response.ok) {
                throw new Error(`โหลดรูปไม่สำเร็จ (${response.status})`);
            }

            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);

            if (uploadedSatelliteImage) {
                URL.revokeObjectURL(uploadedSatelliteImage);
            }

            setUploadedSatelliteImage(objectUrl);
            toast({
                title: "โหลดรูปดาวเทียมแล้ว",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "โหลดรูปดาวเทียมไม่สำเร็จ",
                description: error instanceof Error ? error.message : "โปรดลองใหม่อีกครั้ง",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoadingSatelliteImage(false);
        }
    };

    return (
        <>
            <Formik<InformationProp>
                enableReinitialize
                initialValues={initialValues}
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
                                <NewSlip {...values} satelliteImage={uploadedSatelliteImage} />
                            </Flex>
                            <Flex p="3" w={['100%', '100%', '50%', '50%', '50%']} justifyContent="center">
                                <Form style={{ width: "100%" }}>
                                    <VStack alignItems="start" spacing={3}>
                                        <Heading fontSize="calc(0.75em + 1.2vmin)">แก้ไขข้อมูล</Heading>
                                        <Field
                                            as={Input}
                                            type="date"
                                            name="date"
                                            border="1px"
                                            borderColor="#ffffff1a"
                                        />
                                        <Select
                                            name="time"
                                            value={values.time}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            border="1px"
                                            borderColor="#ffffff1a"
                                        >
                                            <option value="07:00 น." label="0700" >
                                               0700
                                            </option>
                                            <option value="10:00 น.">
                                                1000
                                            </option>
                                            <option value="13:00 น.">
                                                1300
                                            </option>
                                            <option value="16:00 น.">
                                                1600
                                            </option>
                                            <option value="19:00 น.">
                                                1900
                                            </option>
                                            <option value="22:00 น.">
                                                2200
                                            </option>
                                            <option value="01:00 น.">
                                                0100
                                            </option>
                                            <option value="04:00 น.">
                                                0400
                                            </option>
                                        </Select>
                                        <Field as={Textarea} name="description" border="1px" borderColor="#ffffff1a" />
                                        
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
                                        <Select
                                            name="wind_direction"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            border="1px"
                                            borderColor="#ffffff1a"
                                        >
                                            <option value="w1" label="เลือกทิศลม" >
                                                เลือกทิศลม
                                            </option>
                                            <option value="เหนือ">
                                                เหนือ
                                            </option>
                                            <option value="ตะวันออกเฉียงเหนือ">
                                                ตะวันออกเฉียงเหนือ
                                            </option>
                                            <option value="ตะวันออก">
                                                ตะวันออก
                                            </option>
                                            <option value="ตะวันออกเฉียงใต้">
                                                ตะวันออกเฉียงใต้
                                            </option>
                                            <option value="ใต้">
                                                ใต้
                                            </option>
                                            <option value="ตะวันตกเฉียงใต้">
                                                ตะวันตกเฉียงใต้
                                            </option>
                                            <option value="ตะวันตก">
                                                ตะวันตก
                                            </option>
                                            <option value="ตะวันตกเฉียงเหนือ">
                                                ตะวันตกเฉียงเหนือ
                                            </option>
                                        </Select>
                                        <Field as={Textarea} name="wind_speed" border="1px" borderColor="#ffffff1a" />
                                        <FormControl>
                                            <FormLabel fontSize="12px" mb="1">
                                                รูปดาวเทียม
                                            </FormLabel>
                                            <Button
                                                type="button"
                                                bg="#0f766e"
                                                _hover={{ bg: "#115e59" }}
                                                color="#fff"
                                                fontWeight="600"
                                                isLoading={isLoadingSatelliteImage}
                                                onClick={loadSatelliteImage}
                                            >
                                                โหลดรูปดาวเทียม
                                            </Button>
                                            <FormHelperText color="#cbd5e1">
                                                ระบบจะโหลดรูปมาเก็บเป็นไฟล์ชั่วคราวใน browser แล้วนำไปวาดลง canvas
                                            </FormHelperText>
                                        </FormControl>
                                        <Button
                                            type="button"
                                            bg="#1d4ed8"
                                            _hover={{ bg: "#1e40af" }}
                                            fontWeight="600"
                                            color="#fff"
                                            onClick={async () => {
                                                try {
                                                    await savePageState("page1", values);
                                                    toast({
                                                        title: "บันทึกข้อมูลหน้า 1 แล้ว",
                                                        status: "success",
                                                        duration: 2000,
                                                        isClosable: true,
                                                    });
                                                } catch (error) {
                                                    toast({
                                                        title: "บันทึกข้อมูลหน้า 1 ไม่สำเร็จ",
                                                        status: "error",
                                                        duration: 2000,
                                                        isClosable: true,
                                                    });
                                                }
                                            }}
                                        >
                                            บันทึกข้อมูล
                                        </Button>

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

const NewSlip = (props: InformationProp & { satelliteImage?: string }) => {
    const ref = useRef<HTMLCanvasElement>(null);
    const [assets, setAssets] = useState<{
        bg: ImageBitmap;
        w1: ImageBitmap;
        w2: ImageBitmap;
        w3: ImageBitmap;
        w4: ImageBitmap;
        w5: ImageBitmap;
        w6: ImageBitmap;
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
            const [bg, w1, w2, w3, w4, w5, w6] = await Promise.all([
                fetchToBitmap(`${import.meta.env.VITE_API_ASSETS}bg1.jpg`),
                fetchToBitmap(`${import.meta.env.VITE_API_ASSETS}w1.png`),
                fetchToBitmap(`${import.meta.env.VITE_API_ASSETS}w2.png`),
                fetchToBitmap(`${import.meta.env.VITE_API_ASSETS}w3.png`),
                fetchToBitmap(`${import.meta.env.VITE_API_ASSETS}w4.png`),
                fetchToBitmap(`${import.meta.env.VITE_API_ASSETS}w5.png`),
                fetchToBitmap(`${import.meta.env.VITE_API_ASSETS}w6.png`),
            ]);

            setAssets({
                bg,
                w1,
                w2,
                w3,
                w4,
                w5,
                w6
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
            ctx.font = "bold 2.6em Kanit";
    
            ctx.textAlign = "left";
            ctx.lineWidth = 6;
            ctx.shadowColor = "#00000066";
            ctx.shadowBlur = 8;
            ctx.fillStyle = "#00000000";
            ctx.fillText(dayjs(props.date).format("วันที่ DD MMMM YYYY"), WIDTH / 2 - 255, 174);
            ctx.fillStyle = "#fa9744";
            ctx.strokeStyle = "#9a4c11";
            ctx.strokeText(dayjs(props.date).format("วันที่ DD MMMM YYYY"), WIDTH / 2 - 255, 174);
            ctx.fillText(dayjs(props.date).format("วันที่ DD MMMM YYYY"), WIDTH / 2 - 255, 174);
    
            ///time
            ctx.textAlign = "center";
            ctx.lineWidth = 6;
            ctx.shadowColor = "#00000066";
            ctx.shadowBlur = 8;
            ctx.fillStyle = "#00000000";
            ctx.fillText(props.time, WIDTH - 320, 170, 140,);
            ctx.fillStyle = "#fa9744";
            ctx.strokeStyle = "#9a4c11";
            ctx.strokeText(props.time, WIDTH - 320, 170, 140,);
            ctx.fillText(props.time, WIDTH - 320, 170, 140,);
    
            ctx.shadowBlur = 0;
    
            ctx.textAlign = "center";
            ctx.font = `${props.description_fontsize}em Kanit`;
            ctx.fillStyle = "black";
            printAt(ctx, props.description, WIDTH - 580, props.description_position, parseFloat(props.description_lineheight), 9000);  // ใช้ parseFloat เพื่อแปลง string เป็น number
            ctx.font = "bold 2em Kanit";
            ctx.fillStyle = "#8d4f16";
            printAt(ctx, props.wind_direction, WIDTH - 220, 754, 40, 9000);
            ctx.fillStyle = "#000";
            ctx.font = "bold 2.7em Kanit";
            printAt(ctx, props.wind_speed, WIDTH - 220, 920, 45, 9000);
            ctx.font = "bold 2.6em Kanit";
    
            ctx.drawImage(assets[props.weather], WIDTH - 50 - 40 - 325, 380, 400, 300);
    
            var img = new Image();
            img.src = props.satelliteImage || `/.netlify/functions/satellite-image?t=${Date.now()}`;
            img.onload = function () {
                ctx.drawImage(img,
                    480, 200,
                    300, 500,
                    37, 240,
                    656, 902);
            };
            img.onerror = function () {
                console.error("Failed to load image");
                // คุณสามารถใช้รูปภาพสำรองหรือจัดการข้อผิดพลาดได้ตามต้องการ
            };
        }
    }, [props, assets]);
    

    return (
        <Flex pb="8" w={['100%', '100%', '70%', '60%', '60%']} alignItems="center" justifyContent={["center", "center", "start", "start"]} direction="column">
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

export default Page1;
