import Font from "@/components/Font";
import {
  Box,
  SimpleGrid,
  Button,
  Flex,
  UnorderedList,
  ListItem,
  Img,
} from "@chakra-ui/react";
import { useLocation } from "wouter";

function Card(props: any) {
  const [, setLocation] = useLocation();
  return (
    <Flex justifyContent="center" data-aos="fade-right">
      <Flex direction="column" h="fit-content" w="250px" color="#fff" border="1px" borderColor="#ffffff1a" bg="rgba(255, 255, 255, 0.05)" bgImage="" p="4" borderRadius="10px">
        <Flex justifyContent="center" alignItems="center">
           <Flex bg={props.bankcolor} h="85px" justifyContent="center" alignItems="center" borderRadius="12px" p="2" mb="2">
            <Img w="70px" src={props.img} />
          </Flex> 
        </Flex>
        <Box textAlign="center" fontSize="1.2rem" fontWeight="600" mb="2">{props.bankname}</Box>
        <Box fontSize="0.875rem">{props.description}</Box>
        <Button disabled={props.disabled} onClick={() => setLocation(`/app/${props.href}`)} fontSize=".875rem" bg="#ffffff1a" type="submit" _hover={{ bg: "#fff3", border: "0", borderColor: "#fff3" }} fontWeight="400" mt="6" color="#fff" w="100%">
          {props.buttonname}
        </Button>
      </Flex>
    </Flex>
  )
}

const App = () => {
  const [, setLocation] = useLocation();
  return (
    <>
      <Flex h="100vh" gap="10px" justifyContent="center" direction={["column","row","row","row"]}>
        <Card bankcolor="#222222" img={"https://png.pngtree.com/png-vector/20190628/ourmid/pngtree-satellite-icon-for-your-project-png-image_1521038.jpg"} bankname="การวิเคราะห์ภาพดาวเทียม" description="สำหรับสร้างรูปภาพเกียวกับการวิเคราะห์ภาพดาวเทียม" disabled={false} href="page1" buttonname="เข้าใช้งาน" />
        <Card bankcolor="#222222" img={"https://e7.pngegg.com/pngimages/729/501/png-clipart-imaging-radar-weather-radar-desktop-others-leaf-symmetry-thumbnail.png"} bankname="ส่วนติดตามสภาวะอากาศ" description="สำหรับสร้างรูปภาพเกียวกับสภาวะอากาศ" disabled={false} href="page2" buttonname="เข้าใช้งาน" />
        <Card bankcolor="#222222" img={"https://e7.pngegg.com/pngimages/130/743/png-clipart-line-messaging-apps-logo-sticker-line-text-rectangle.png"} bankname="ระบบส่ง Line ด้วย Token" description="สำหรับส่ง Line สามารถเข้าไปใช้งานระบบส่ง Line ได้" disabled={false} href="line" buttonname="เข้าใช้งาน" />
      </Flex>
    </>
  );
};

export default App;
