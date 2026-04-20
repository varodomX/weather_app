import Font from "@/components/Font";
import {
  Box,
  Button,
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
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Formik, Field, Form } from "formik";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";
import th from "dayjs/locale/th";
import html2canvas from "html2canvas";
import { loadPageState, savePageState } from "@/lib/firebaseStore";

const HEIGHT = 1814;
const WIDTH = 1134;
const DESCRIPTION_BOX_X = 25;
const DESCRIPTION_BOX_WIDTH = WIDTH - 50;
const DESCRIPTION_TEXT_PADDING_X = 24;
const DESCRIPTION_TEXT_PADDING_Y = 28;
const HIGHLIGHT_PROVINCES = new Set([
  "จ.หนองบัวลำภู",
  "จ.อุดรธานี",
  "จ.เลย",
  "จ.ขอนแก่น",
  "จ.สกลนคร",
  "จ.นครพนม",
  "จ.ชัยภูมิ",
  "จ.กาฬสินธุ์",
  "จ.ร้อยเอ็ด",
  "จ.มุกดาหาร",
  "จ.บึงกาฬ",
  "จ.เพชรบูรณ์",
  "จ.นครราชสีมา",
  "จ.บุรีรัมย์",
  "จ.สุรินทร์",
  "จ.มหาสารคาม",
  "จ.ยโสธร",
  "จ.ศรีสะเกษ",
  "จ.อุบลราชธานี",
  "จ.อุตรดิตถ์",
]);

interface WrappedLineToken {
  text: string;
  color: string;
}

interface ArrowDragState {
  arrowId: string;
  mode: "move" | "resize" | "rotate";
  startClientX: number;
  startClientY: number;
  startArrowX: number;
  startArrowY: number;
  startArrowSize: number;
}

interface ArrowItem {
  id: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

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
  radar_image: string;
}

interface Page2StoredState {
  values: InformationProp;
  arrows: ArrowItem[];
}

const RAIN_TYPE_LABELS = {
  thunderstorm: "ตรวจพบกลุ่มฝนฟ้าคะนอง⛈️",
  rainfall: "ตรวจพบกลุ่มฝนธรรมดา🌧️",
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

const createArrow = (index: number): ArrowItem => ({
  id: `arrow-${index}-${Date.now()}`,
  x: 690,
  y: 930,
  size: 110,
  rotation: 45,
});

const DEFAULT_PAGE2_VALUES: InformationProp = {
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
  radar_image: "",
};

const Page2 = () => {
  const [uploadedRadarImage, setUploadedRadarImage] = useState("");
  const [arrows, setArrows] = useState<ArrowItem[]>([]);
  const [selectedArrowId, setSelectedArrowId] = useState<string | null>(null);
  const [initialValues, setInitialValues] =
    useState<InformationProp>(DEFAULT_PAGE2_VALUES);
  const toast = useToast();

  useEffect(() => {
    const syncSavedValues = async () => {
      try {
        const savedState = await loadPageState<Page2StoredState>("page2");

        if (savedState) {
          setInitialValues({
            ...DEFAULT_PAGE2_VALUES,
            ...savedState.values,
            radar_image:
              savedState.values.radar_image?.startsWith("blob:")
                ? ""
                : savedState.values.radar_image,
          });
          setArrows(savedState.arrows || []);
          setSelectedArrowId(savedState.arrows?.[0]?.id ?? null);
        }
      } catch (error) {
        console.error("Failed to load page2 state", error);
      }
    };

    syncSavedValues();
  }, []);

  useEffect(() => {
    return () => {
      if (uploadedRadarImage) {
        URL.revokeObjectURL(uploadedRadarImage);
      }
    };
  }, [uploadedRadarImage]);

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
        {({
          values,
          setFieldValue,
        }) => (
          <Box w="100%" h="100%" zIndex="-1">
            <Flex
              direction={["column", "row", "row", "row", "row"]}
              justifyContent="center"
            >
              <Flex justifyContent="center">
                <NewSlip
                  {...values}
                  arrows={arrows}
                  selectedArrowId={selectedArrowId}
                  onArrowChange={(arrowId, next) => {
                    setArrows((current) =>
                      current.map((arrow) =>
                        arrow.id === arrowId ? { ...arrow, ...next } : arrow,
                      ),
                    );
                  }}
                  onArrowSelect={setSelectedArrowId}
                />
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
                          setFieldValue("description_fontsize", "2");
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
                              ตรวจพบกลุ่มฝนฟ้าคะนอง⛈️
                            </Radio>
                            <Radio value="rainfall">
                              ตรวจพบกลุ่มฝนธรรมดา🌧️
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
                            setFieldValue("description_fontsize", "2");
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
                            setFieldValue("description_fontsize", "2");
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
                    <Field as={Textarea} name="description2" height="200px"/>
                    <HStack spacing={2}>
                      <Button
                        type="button"
                        size="sm"
                        bg="#e03131"
                        color="#fff"
                        _hover={{ bg: "#c92a2a" }}
                        onClick={() => {
                          const nextArrow = createArrow(arrows.length + 1);
                          setArrows((current) => [...current, nextArrow]);
                          setSelectedArrowId(nextArrow.id);
                        }}
                      >
                        เพิ่มลูกศร
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        bg="#fa5252"
                        color="#fff"
                        _hover={{ bg: "#e03131" }}
                        isDisabled={!selectedArrowId}
                        onClick={() => {
                          if (!selectedArrowId) {
                            return;
                          }

                          setArrows((current) => {
                            const remaining = current.filter(
                              (arrow) => arrow.id !== selectedArrowId,
                            );
                            setSelectedArrowId(
                              remaining[remaining.length - 1]?.id ?? null,
                            );
                            return remaining;
                          });
                        }}
                      >
                        ลบลูกศรที่เลือก
                      </Button>
                    </HStack>
                    {arrows.length > 0 && (
                      <Box fontSize="12px">
                        คลิกลูกศรเพื่อเลือก ลากเพื่อย้ายตำแหน่ง ลากมุมขวาล่างเพื่อขยาย และลากวงกลมด้านบนเพื่อหมุน
                      </Box>
                    )}
                    <FormControl>
                      <FormLabel fontSize="12px">อัปโหลดภาพเรดาร์</FormLabel>
                      <Input
                        type="file"
                        accept=".gif,.png,.jpg,.jpeg,image/gif,image/png,image/jpeg"
                        p={1}
                        onChange={(event) => {
                          const file = event.currentTarget.files?.[0];

                          if (!file) {
                            return;
                          }

                          if (uploadedRadarImage) {
                            URL.revokeObjectURL(uploadedRadarImage);
                          }

                          const objectUrl = URL.createObjectURL(file);
                          setUploadedRadarImage(objectUrl);
                          setFieldValue("radar_image", objectUrl);
                        }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="12px">ขนาดฟ้อน</FormLabel>
                      <Field as={Input} name="description_fontsize" value="2" isReadOnly />
                    </FormControl>
                    <Button
                      type="button"
                      bg="#1d4ed8"
                      color="#fff"
                      _hover={{ bg: "#1e40af" }}
                      onClick={async () => {
                        try {
                          await savePageState<Page2StoredState>("page2", {
                            values: {
                              ...values,
                              radar_image: values.radar_image.startsWith("blob:")
                                ? ""
                                : values.radar_image,
                            },
                            arrows,
                          });
                          toast({
                            title: "บันทึกข้อมูลหน้า 2 แล้ว",
                            status: "success",
                            duration: 2000,
                            isClosable: true,
                          });
                        } catch (error) {
                          toast({
                            title: "บันทึกข้อมูลหน้า 2 ไม่สำเร็จ",
                            status: "error",
                            duration: 2000,
                            isClosable: true,
                          });
                        }
                      }}
                    >
                      บันทึกข้อมูล
                    </Button>

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

const NewSlip = (
  props: InformationProp & {
    arrows: ArrowItem[];
    selectedArrowId: string | null;
    onArrowChange: (
      arrowId: string,
      next: Partial<Pick<ArrowItem, "x" | "y" | "size" | "rotation">>,
    ) => void;
    onArrowSelect: (arrowId: string | null) => void;
  },
) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [assets, setAssets] = useState<{
    bg: ImageBitmap;
  } | null>(null);
  const [dragState, setDragState] = useState<ArrowDragState | null>(null);

  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.tz.setDefault("Asia/Bangkok");
  dayjs.locale(th);

  const getWrappedLines = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
  ) => {
    // ถ้าไม่มีเว้นวรรค ให้ถือเป็น 1 คำและย้ายลงทั้งคำ ไม่ตัดกลางคำ
    const paragraphs = text.split("\n");
    const lines: WrappedLineToken[][] = [];

    paragraphs.forEach((paragraph) => {
      if (!paragraph) {
        lines.push([]);
        return;
      }

      const words = paragraph.trim().split(/\s+/);
      let currentLine: WrappedLineToken[] = [];
      let currentLineText = "";

      words.forEach((word) => {
        const normalizedWord = word.replace(/[,:;]+$/g, "");
        const token = {
          text: word,
          color: HIGHLIGHT_PROVINCES.has(normalizedWord) ? "#d92d20" : "#000",
        };
        const testLine = currentLineText ? `${currentLineText} ${word}` : word;

        if (ctx.measureText(testLine).width > maxWidth && currentLineText) {
          lines.push(currentLine);
          currentLine = [token];
          currentLineText = word;
          return;
        }

        currentLine.push(token);
        currentLineText = testLine;
      });

      if (currentLine.length > 0) {
        lines.push(currentLine);
      }
    });

    return lines;
  };

  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    rotation: number,
  ) => {
    const scale = size / 110;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.beginPath();
    ctx.moveTo(0, -55 * scale);
    ctx.lineTo(48 * scale, -8 * scale);
    ctx.lineTo(22 * scale, -8 * scale);
    ctx.lineTo(22 * scale, 55 * scale);
    ctx.lineTo(-22 * scale, 55 * scale);
    ctx.lineTo(-22 * scale, -8 * scale);
    ctx.lineTo(-48 * scale, -8 * scale);
    ctx.closePath();
    ctx.fillStyle = "#ff2a00";
    ctx.fill();
    ctx.lineWidth = 4 * scale;
    ctx.strokeStyle = "#ffe600";
    ctx.stroke();
    ctx.restore();
  };

  useEffect(() => {
    if (!dragState) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      const preview = previewRef.current;

      if (!preview) {
        return;
      }

      const widthScale = preview.clientWidth / WIDTH;
      const heightScale = preview.clientHeight / HEIGHT;
      const deltaX = (event.clientX - dragState.startClientX) / widthScale;
      const deltaY = (event.clientY - dragState.startClientY) / heightScale;

      if (dragState.mode === "move") {
        props.onArrowChange(dragState.arrowId, {
          x: Math.max(0, Math.min(WIDTH, dragState.startArrowX + deltaX)),
          y: Math.max(
            0,
            Math.min(HEIGHT, dragState.startArrowY + deltaY),
          ),
          size: dragState.startArrowSize,
        });
        return;
      }

      if (dragState.mode === "rotate") {
        const rect = preview.getBoundingClientRect();
        const centerX =
          rect.left + (dragState.startArrowX / WIDTH) * preview.clientWidth;
        const centerY =
          rect.top + (dragState.startArrowY / HEIGHT) * preview.clientHeight;
        const angle =
          (Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180) /
            Math.PI +
          90;

        props.onArrowChange(dragState.arrowId, {
          rotation: angle,
        });
        return;
      }

      const resizeDelta = Math.max(deltaX, deltaY);
      props.onArrowChange(dragState.arrowId, {
        x: dragState.startArrowX,
        y: dragState.startArrowY,
        size: Math.max(40, dragState.startArrowSize + resizeDelta),
      });
    };

    const handleMouseUp = () => {
      setDragState(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragState, props]);

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
      img.src =
        props.radar_image ||
        "https://weather.tmd.go.th/kkn/kkn240_latest.gif";

      img.onload = function () {
        // 👉 redraw ใหม่ทั้งหมดในนี้ (กัน async ทับ)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // bg
        ctx.drawImage(assets.bg, 0, 0, canvas.width, canvas.height);

        // radar
        ctx.drawImage(img, 0, 5, 890, 800, 140, 248.5, 1058, 800);

        props.arrows.forEach((arrow) => {
          drawArrow(
            ctx,
            Number(arrow.x),
            Number(arrow.y),
            Number(arrow.size),
            Number(arrow.rotation),
          );
        });

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
          // วาดข้อความทีละคำ เพื่อให้ชื่อจังหวัดที่กำหนดเป็นสีแดงได้
          wrappedLines.forEach((line, index) => {
            let currentX = DESCRIPTION_BOX_X + DESCRIPTION_TEXT_PADDING_X;
            const y =
              props.description_position +
              DESCRIPTION_TEXT_PADDING_Y +
              lineHeight +
              index * lineHeight;

            line.forEach((token, tokenIndex) => {
              const text = tokenIndex === 0 ? token.text : ` ${token.text}`;
              ctx.fillStyle = token.color;
              ctx.fillText(text, currentX, y);
              currentX += ctx.measureText(text).width;
            });
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
        <Box
          ref={previewRef}
          position="relative"
          width="70%"
          maxW={`${WIDTH}px`}
          lineHeight={0}
        >
          <canvas
            id="slip"
            height={HEIGHT}
            width={WIDTH}
            style={{ width: "100%", height: "auto", display: "block" }}
            ref={ref}
          />
          {props.arrows.map((arrow) => {
            const previewArrowWidth = arrow.size * 0.87;
            const previewArrowHeight = arrow.size;
            const previewArrowLeft = arrow.x - previewArrowWidth / 2;
            const previewArrowTop = arrow.y - previewArrowHeight / 2;
            const isSelected = props.selectedArrowId === arrow.id;

            return (
              <Box
                key={arrow.id}
                position="absolute"
                left={`${(previewArrowLeft / WIDTH) * 100}%`}
                top={`${(previewArrowTop / HEIGHT) * 100}%`}
                width={`${(previewArrowWidth / WIDTH) * 100}%`}
                height={`${(previewArrowHeight / HEIGHT) * 100}%`}
                cursor="move"
                transform={`rotate(${arrow.rotation}deg)`}
                transformOrigin="center center"
                onMouseDown={(event) => {
                  event.preventDefault();
                  props.onArrowSelect(arrow.id);
                  setDragState({
                    arrowId: arrow.id,
                    mode: "move",
                    startClientX: event.clientX,
                    startClientY: event.clientY,
                    startArrowX: Number(arrow.x),
                    startArrowY: Number(arrow.y),
                    startArrowSize: Number(arrow.size),
                  });
                }}
              >
                <Box
                  position="absolute"
                  inset="0"
                  bg="#ff2a00"
                  border={isSelected ? "4px solid #00d4ff" : "4px solid #ffe600"}
                  sx={{
                    clipPath:
                      "polygon(50% 0%, 100% 43%, 72% 43%, 72% 100%, 28% 100%, 28% 43%, 0% 43%)",
                  }}
                />
                {isSelected && (
                  <>
                    <Box
                      position="absolute"
                      right="-8px"
                      bottom="-8px"
                      w="16px"
                      h="16px"
                      bg="#ffffff"
                      border="2px solid #1a1a1a"
                      borderRadius="2px"
                      cursor="nwse-resize"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setDragState({
                          arrowId: arrow.id,
                          mode: "resize",
                          startClientX: event.clientX,
                          startClientY: event.clientY,
                          startArrowX: Number(arrow.x),
                          startArrowY: Number(arrow.y),
                          startArrowSize: Number(arrow.size),
                        });
                      }}
                    />
                    <Box
                      position="absolute"
                      left="50%"
                      top="-26px"
                      transform="translateX(-50%)"
                      w="16px"
                      h="16px"
                      bg="#00d4ff"
                      border="2px solid #1a1a1a"
                      borderRadius="999px"
                      cursor="grab"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setDragState({
                          arrowId: arrow.id,
                          mode: "rotate",
                          startClientX: event.clientX,
                          startClientY: event.clientY,
                          startArrowX: Number(arrow.x),
                          startArrowY: Number(arrow.y),
                          startArrowSize: Number(arrow.size),
                        });
                      }}
                    />
                  </>
                )}
              </Box>
            );
          })}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Page2;
