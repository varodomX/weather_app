import Font from "@/components/Font";
import {
  Box,
  Input,
  VStack,
  Select,
  Flex,
  Textarea,
  SimpleGrid,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Formik, Field, Form } from "formik";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";
import th from "dayjs/locale/th";
import html2canvas from "html2canvas";

const HEIGHT = 1814;
const WIDTH = 1134;
const DESCRIPTION_BOX_X = 25;
const DESCRIPTION_BOX_WIDTH = WIDTH - 50;
const DESCRIPTION_TEXT_PADDING_X = 24;
const DESCRIPTION_TEXT_PADDING_Y = 28;

interface InformationProp {
  description1: string;
  description2: string;
  description_position: number;
  description_fontsize: string;
  description_lineheight: string;
  date: string;
  weather: "w1" | "w2" | "w3" | "w4" | "w5" | "w6";
  hour: string;
  minute: "00" | "15" | "30" | "45";
  rain_status: "rain" | "no_rain";
  rain_type: "thunderstorm" | "rainfall";
  rain_intensity: "light_medium" | "medium_heavy" | "heavy_very_heavy";
  rain_area_trend: "increase" | "decrease";
}

const RAIN_TYPE_LABELS = {
  thunderstorm: "ตรวจพบกลุ่มฝนฟ้าคะนอง",
  rainfall: "ตรวจพบกลุ่มฝนธรรมดา",
} as const;

const RAIN_INTENSITY_LABELS = {
  light_medium: "กำลังอ่อน - ปานกลาง",
  medium_heavy: "กำลังปานกลาง - หนัก",
  heavy_very_heavy: "กำลังหนัก - หนักมาก",
} as const;

const RAIN_AREA_TREND_LABELS = {
  increase: "ความแรงเพิ่มขึ้น พื้นที่เพิ่มขึ้น",
  decrease: "ความแรงลดลง พื้นที่ลดลง",
} as const;

const getRainDescription = (
  rainType: InformationProp["rain_type"],
  rainIntensity: InformationProp["rain_intensity"],
  rainAreaTrend: InformationProp["rain_area_trend"],
) => {
  return `${RAIN_TYPE_LABELS[rainType]} ${RAIN_INTENSITY_LABELS[rainIntensity]} ${RAIN_AREA_TREND_LABELS[rainAreaTrend]}`;
};

const getCombinedDescription = (props: InformationProp) => {
  return [props.description1, props.description2]
    .map((text) => text.trim())
    .filter(Boolean)
    .join("\n");
};

const Page2 = () => {
  return (
    <>
      <Formik<InformationProp>
        initialValues={{
          description1: getRainDescription(
            "thunderstorm",
            "light_medium",
            "increase",
          ),
          description2: ``,
          description_position: 1100,
          description_fontsize: "2",
          description_lineheight: "42",
          weather: "w1",
          date: Date(),
          hour: dayjs().format("HH"),
          minute: "45",
          rain_status: "rain",
          rain_type: "thunderstorm",
          rain_intensity: "light_medium",
          rain_area_trend: "increase",
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
        {({
          values,
          handleChange,
          handleBlur,
          setFieldValue,
        }) => (
          <Box w="100%" h="100%" zIndex="-1">
            <Flex
              direction={["column", "row", "row", "row", "row"]}
              justifyContent="center"
            >
              <Flex justifyContent="center">
                <NewSlip {...values} />
              </Flex>
              <Flex
                p="3"
                w={["100%", "100%", "50%", "50%", "50%"]}
                justifyContent="center"
              >
                <Form style={{ width: "100%" }}>
                  <VStack alignItems="start" spacing={3}>
                    <SimpleGrid columns={2} spacing={2} w="100%">
                      <Field as={Input} name="hour" placeholder="HH" />
                      <Field as={Select} name="minute">
                        <option value="00">00</option>
                        <option value="15">15</option>
                        <option value="30">30</option>
                        <option value="45">45</option>
                      </Field>
                      <FormControl>
                        <FormLabel fontSize="12px">สถานการณ์ฝน</FormLabel>
                        <Field as={Select} name="rain_status">
                          <option value="no_rain">ไม่มีฝน</option>
                          <option value="rain">มีฝน</option>
                        </Field>
                      </FormControl>
                    </SimpleGrid>
                    {values.rain_status === "rain" && (
                      <FormControl>
                        <FormLabel fontSize="12px">ประเภทฝน</FormLabel>
                        <RadioGroup
                          value={values.rain_type}
                          onChange={(value) => {
                            const rainType =
                              value as InformationProp["rain_type"];
                            setFieldValue("rain_type", rainType);
                            // เอาข้อความประเภทฝน + ความแรงฝน ไปใส่ใน description โดยตรง
                            setFieldValue(
                              "description1",
                              getRainDescription(
                                rainType,
                                values.rain_intensity,
                                values.rain_area_trend,
                              ),
                            );
                          }}
                        >
                          <HStack spacing={4}>
                            <Radio value="thunderstorm">
                              ตรวจพบกลุ่มฝนฟ้าคะนอง
                            </Radio>
                            <Radio value="rainfall">
                              ตรวจพบกลุ่มฝนธรรมดา
                            </Radio>
                          </HStack>
                        </RadioGroup>
                      </FormControl>
                    )}
                    {values.rain_status === "rain" && (
                      <FormControl>
                        <FormLabel fontSize="12px">ความแรงฝน</FormLabel>
                        <RadioGroup
                          value={values.rain_intensity}
                          onChange={(value) => {
                            const rainIntensity =
                              value as InformationProp["rain_intensity"];
                            setFieldValue("rain_intensity", rainIntensity);
                            // ต่อท้ายข้อความความแรงฝนเข้ากับประเภทฝนใน description
                            setFieldValue(
                              "description1",
                              getRainDescription(
                                values.rain_type,
                                rainIntensity,
                                values.rain_area_trend,
                              ),
                            );
                          }}
                        >
                          <HStack spacing={4} wrap="wrap">
                            <Radio value="light_medium">
                              กำลังอ่อน - ปานกลาง
                            </Radio>
                            <Radio value="medium_heavy">
                              กำลังปานกลาง - หนัก
                            </Radio>
                            <Radio value="heavy_very_heavy">
                              กำลังหนัก - หนักมาก
                            </Radio>
                          </HStack>
                        </RadioGroup>
                      </FormControl>
                    )}
                    {values.rain_status === "rain" && (
                      <FormControl>
                        <FormLabel fontSize="12px">ขนาดฝน</FormLabel>
                        <RadioGroup
                          value={values.rain_area_trend}
                          onChange={(value) => {
                            const rainAreaTrend =
                              value as InformationProp["rain_area_trend"];
                            setFieldValue("rain_area_trend", rainAreaTrend);
                            setFieldValue(
                              "description1",
                              getRainDescription(
                                values.rain_type,
                                values.rain_intensity,
                                rainAreaTrend,
                              ),
                            );
                          }}
                        >
                          <HStack spacing={4} wrap="wrap">
                            <Radio value="increase">
                              ความแรงเพิ่มขึ้น พื้นที่เพิ่มขึ้น
                            </Radio>
                            <Radio value="decrease">
                              ความแรงลดลง พื้นที่ลดลง
                            </Radio>
                          </HStack>
                        </RadioGroup>
                      </FormControl>
                    )}
                    <Field as={Textarea} name="description1" />
                    <Field as={Textarea} name="description2" />
                    <Field as={Input} name="description_fontsize" />
                    <Field as={Input} name="description_lineheight" />
                    <Field as={Input} name="description_position" />

                    <Box fontSize="12px">
                      วิธีโหลดรูป! คลิกขวา Save Image as
                    </Box>
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
  dayjs.tz.setDefault("Asia/Bangkok");
  dayjs.locale(th);

  const getWrappedLines = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
  ) => {
    // รองรับข้อความไทยที่ไม่มีเว้นวรรค โดยวัดความกว้างทีละตัวอักษร
    const paragraphs = text.split("\n");
    const lines: string[] = [];

    paragraphs.forEach((paragraph) => {
      if (!paragraph) {
        lines.push("");
        return;
      }

      let currentLine = "";

      for (const char of paragraph) {
        const testLine = currentLine + char;

        if (ctx.measureText(testLine).width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = char;
        } else {
          currentLine = testLine;
        }
      }

      lines.push(currentLine);
    });

    return lines;
  };

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
      // 1. เคลียร์ canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 2. วาดพื้นหลังเต็ม
      ctx.drawImage(assets.bg, 0, 0, canvas.width, canvas.height);

      // 3. วาด radar (ต้องรอโหลดก่อน)
      const img = new Image();
      img.src = "https://weather.tmd.go.th/kkn/kkn240_latest.gif";

      img.onload = function () {
        // 👉 redraw ใหม่ทั้งหมดในนี้ (กัน async ทับ)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // bg
        ctx.drawImage(assets.bg, 0, 0, canvas.width, canvas.height);

        // radar
        ctx.drawImage(img, 0, 5, 890, 800, 140, 248.5, 1058, 800);

        // ====== DATE ======
        ctx.shadowColor = "#00000066";
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#8d5018";
        ctx.textAlign = "center";
        ctx.font = "bold 1.9em Kanit";

        ctx.fillText(
          dayjs(props.date)
            .hour(Number(props.hour))
            .minute(Number(props.minute))
            .format("วันที่ DD MMMM YYYY เวลา HH:mm น."),
          WIDTH / 2,
          185,
        );

        if (props.rain_status === "rain") {
          const lineHeight = Number(props.description_lineheight);

          ctx.fillStyle = "#000";
          ctx.textAlign = "left";
          ctx.font = `${props.description_fontsize}em Kanit`;
          // ใช้จำนวนบรรทัดหลัง wrap จริง เพื่อนำไปคำนวณความสูงของกล่อง
          const wrappedLines = getWrappedLines(
            ctx,
            getCombinedDescription(props),
            DESCRIPTION_BOX_WIDTH - DESCRIPTION_TEXT_PADDING_X * 2,
          );
          const boxHeight =
            wrappedLines.length * lineHeight + DESCRIPTION_TEXT_PADDING_Y * 2;

          // box
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(
            DESCRIPTION_BOX_X,
            props.description_position,
            DESCRIPTION_BOX_WIDTH,
            boxHeight,
          );

          ctx.strokeStyle = "#000";
          ctx.lineWidth = 4;
          ctx.strokeRect(
            DESCRIPTION_BOX_X,
            props.description_position,
            DESCRIPTION_BOX_WIDTH,
            boxHeight,
          );

          // text
          ctx.fillStyle = "#000";
          // วาดข้อความตามบรรทัดที่ถูกตัดแล้ว เพื่อไม่ให้ล้นออกนอก box
          wrappedLines.forEach((line, index) => {
            ctx.fillText(
              line,
              DESCRIPTION_BOX_X + DESCRIPTION_TEXT_PADDING_X,
              props.description_position +
                DESCRIPTION_TEXT_PADDING_Y +
                lineHeight +
                index * lineHeight,
            );
          });
        }
      };
    }
  }, [props, assets]);

  return (
    <Flex direction={["column", "row"]} gap={6} alignItems="flex-start">
      {/* ซ้าย: canvas */}
      <Flex flex="1" justifyContent="center">
        <Font />
        <canvas
          id="slip"
          height={HEIGHT}
          width={WIDTH}
          style={{ width: "70%" }}
          ref={ref}
        />
      </Flex>
    </Flex>
  );
};

export default Page2;
