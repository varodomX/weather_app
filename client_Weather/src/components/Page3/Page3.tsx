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
import axios from 'axios'

const HEIGHT = 1600;
const WIDTH = 2200;


interface InformationProp {
    description: string;
    description_position: number;
    description_fontsize: string;
    description_lineheight: string;
    wind_direction: string;
    wind_speed: string;
    rain: string;
    temp: string;
    press: string;
    humidity:string;
    max:string;
    min:string;
    visibility:string;
    date: string;
    bg: "bg1" | "bg2" | "bg3" | "bg4" | "bg5" | "bg6" | "bg7" | "bg8";
}

const Page1 = () => {
    const [initialValues, setInitialValues] = useState<InformationProp>({
        description: '',
        description_position: 1485,
        description_fontsize: "2",
        description_lineheight: "42",
        wind_direction: "",
        wind_speed: "",
        bg: "bg1",
        rain: "0.0",
        temp: "0.0",
        press: "0.0",
        max: "0.0",
        min: "0.0",
        visibility: "0",
        humidity: "0.0",
        date: Date()
    });

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const [weatherResponse, tempResponse] = await Promise.all([
                    axios.get('https://leaf-weather.onrender.com/api/weather'),
                    axios.get('https://leaf-weather.onrender.com/api/temp')
                ]);

                const stations = weatherResponse.data.Stations.Station;
                const targetStation = stations.find((station: any) => station.WmoStationNumber === "48381");

                if (targetStation) {
                    const observation = targetStation.Observation;
                    const tempData = tempResponse.data[0];
                    
                    setInitialValues({
                        description: `สถานี: ${targetStation.StationNameThai}\nจังหวัด: ${targetStation.Province}`,
                        description_position: 1485,
                        description_fontsize: "2",
                        description_lineheight: "42",
                        wind_direction: observation.WindDirection || '',
                        wind_speed: `${observation.WindSpeed} km/h` || '',
                        bg: "bg1",
                        rain: observation.Rainfall || '0.0',
                        temp: observation.AirTemperature || '0.0',
                        press: observation.MeanSeaLevelPressure || '0.0',
                        max: tempData.max || 'N/A',
                        min: tempData.min || 'N/A',
                        visibility: observation.LandVisibility || '0',
                        humidity: observation.RelativeHumidity || '0.0',
                        date: Date()
                    });
                }
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };

        fetchWeatherData();
    }, []);
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

                        link.download = "weather.jpg";
                        link.href = url;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);


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
                                        <Select
                                            name="bg"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            border="1px"
                                            borderColor="#ffffff1a"
                                        >
                                            <option value="bg1" label="07.00 น." >
                                                07.00 น.
                                            </option>
                                            <option value="bg2">
                                                10.00 น.
                                            </option>
                                            <option value="bg3">
                                                13.00 น.
                                            </option>
                                            <option value="bg4">
                                                16.00 น.
                                            </option>
                                            <option value="bg5">
                                                19.00 น.
                                            </option>
                                            <option value="bg6">
                                                22.00 น.
                                            </option>
                                            <option value="bg7">
                                                01.00 น.
                                            </option>
                                            <option value="bg8">
                                                04.00 น.
                                            </option>
                                            
                                        </Select>
                                        <Field as={Input} type="datetime-local" name="date" border="1px" borderColor="#ffffff1a" />

                                        <SimpleGrid columns={[1, 2, 2, 2]} spacing={2}>
                                            <FormControl>
                                                <FormLabel fontSize="12px">อุณหภูมิ</FormLabel>
                                                <Field as={Input} name="temp" border="1px" borderColor="#ffffff1a" />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel fontSize="12px">ความชื้น</FormLabel>
                                                <Field as={Input} name="humidity" border="1px" borderColor="#ffffff1a" />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel fontSize="12px">ปริมาณฝน</FormLabel>
                                                <Field as={Input} name="rain" border="1px" borderColor="#ffffff1a" />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel fontSize="12px">ความกดอากาศ</FormLabel>
                                                <Field as={Input} name="press" border="1px" borderColor="#ffffff1a" />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel fontSize="12px">อุณหภูมิสูงสุด</FormLabel>
                                                <Field as={Input} name="max" border="1px" borderColor="#ffffff1a" />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel fontSize="12px">อุณหภูมิต่ำสุด</FormLabel>
                                                <Field as={Input} name="min" border="1px" borderColor="#ffffff1a" />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel fontSize="12px">ทัศนวิสัย</FormLabel>
                                                <Field as={Input} name="visibility" border="1px" borderColor="#ffffff1a" />
                                            </FormControl>
                                        </SimpleGrid>
   
                                        <FormLabel fontSize="12px">ทิศลม</FormLabel>

                                        <Select
                                            name="wind_direction"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            border="1px"
                                            borderColor="#ffffff1a"
                                        >
                                            <option value="w1" label="เลือกสภาพอากาศ" >
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

                                        <Button
                                            isLoading={isSubmitting}
                                            type="submit"
                                            bg="#ffffff1a"
                                            _hover={{ bg: "#fff3", border: "0", borderColor: "#fff3" }}
                                            fontWeight="400"
                                            color="#fff"
                                        >
                                            Save Image
                                        </Button>
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
        bg1: ImageBitmap;
        bg2: ImageBitmap;
        bg3: ImageBitmap;
        bg4: ImageBitmap;
        bg5: ImageBitmap;
        bg6: ImageBitmap;
        bg7: ImageBitmap;
        bg8: ImageBitmap;
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
            const [bg1 , bg2, bg3, bg4, bg5, bg6, bg7 , bg8] = await Promise.all([
                fetchToBitmap(`${import.meta.env.VITE_API_ASSETS}0700.jpg`),
                fetchToBitmap(`${import.meta.env.VITE_API_ASSETS}1000.jpg`),
                fetchToBitmap(`${import.meta.env.VITE_API_ASSETS}1300.jpg`),
                fetchToBitmap(`${import.meta.env.VITE_API_ASSETS}1600.jpg`),
                fetchToBitmap(`${import.meta.env.VITE_API_ASSETS}1900.jpg`),
                fetchToBitmap(`${import.meta.env.VITE_API_ASSETS}2200.jpg`),
                fetchToBitmap(`${import.meta.env.VITE_API_ASSETS}0100.jpg`),
                fetchToBitmap(`${import.meta.env.VITE_API_ASSETS}0400.jpg`),
            ]);

            setAssets({
                bg1,
                bg2,
                bg3,
                bg4,
                bg5,
                bg6,
                bg7,
                bg8
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




            ctx.drawImage(assets[props.bg], 0, 0, canvas.width, canvas.height);
            ctx.font = "bold 5.5em Kanit";

            ctx.textAlign = "left";
            ctx.lineWidth = 6;
            ctx.shadowColor = "#00000066";
            ctx.shadowBlur = 8;
            ctx.fillStyle = "#00000000";
            ctx.fillText(dayjs(props.date).format("วันที่ DD MMMM 2567"), WIDTH / 2 - 800, 400);
            ctx.fillStyle = "#fff";
            ctx.strokeStyle = "#fff";
            ctx.strokeText(dayjs(props.date).format("วันที่ DD MMMM 2567"), WIDTH / 2 - 800, 400);
            ctx.fillText(dayjs(props.date).format("วันที่ DD MMMM 2567"), WIDTH / 2 - 800, 400);


            
            ctx.shadowBlur = 0;

            ctx.textAlign = "center";
            ctx.font = `${props.description_fontsize}em Kanit`;
            ctx.fillStyle = "black";
            ctx.font = "bold 5em Kanit";
            ctx.fillStyle = "#000";
            printAt(ctx, props.wind_direction, WIDTH - 420, 690, 40, 9000);
            ///rain
            ctx.font = "bold 5em Kanit";
            ctx.fillStyle = "#FFF";
            printAt(ctx, props.rain, WIDTH - 1250, 694, 40, 9000);
            ///temp
            ctx.font = "bold 6em Kanit";
            ctx.fillStyle = "#000";
            printAt(ctx, props.temp, WIDTH - 1720, 700, 40, 9000);

            ///press
            ctx.font = "bold 4.5em Kanit";
            ctx.fillStyle = "#fff";
            printAt(ctx, props.press, WIDTH - 590, 950, 40, 9000);
            
            ///humidity
            ctx.font = "bold 5.5em Kanit";
            ctx.fillStyle = "#fff";
            printAt(ctx, props.humidity, WIDTH - 1620, 1360, 40, 9000);

            ///max
            ctx.font = "bold 5.5em Kanit";
            ctx.fillStyle = "#fff";
            printAt(ctx, props.max, WIDTH - 1000, 1050, 40, 9000);

            ///min
            ctx.font = "bold 5.5em Kanit";
            ctx.fillStyle = "#fff";
            printAt(ctx, props.min, WIDTH - 1620, 1100, 40, 9000);

            ///visibility
            ctx.font = "bold 6em Kanit";
            ctx.fillStyle = "#000";
            printAt(ctx, props.visibility, WIDTH - 1130, 1380, 40, 9000);

          
            ctx.font = "bold 2.6em Kanit";
            function printAt(context: any, text: string, x: number, y: any, lineHeight: any, fitWidth: number) {
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
            }
           
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

export default Page1;
