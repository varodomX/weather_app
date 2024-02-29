import Font from "@/components/Font";
import {
  Box,
  Input,
  SimpleGrid,
  Button,
  VStack,
  Heading,
  Select,
  Flex,
  Container,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  UnorderedList,
  ListItem,
  Img,
} from "@chakra-ui/react";
import kbank from "@/assets/kbank.svg";
import ktbbank from "@/assets/ktb.svg";
import scbbank from "@/assets/scb.svg";
import bblbank from "@/assets/bbl.svg";
import baacbank from "@/assets/baac.svg";
import gsbbank from "@/assets/gsb.svg";
import tmbbank from "@/assets/tmb.svg";
import ttbbank from "@/assets/ttb.svg";
import uobbank from "@/assets/uob.svg";
import baybank from "@/assets/bay.svg";
import tmnbank from "@/assets/tmn.svg";
import { useLocation } from "wouter";


const HEIGHT = 1332;
const WIDTH = 825;

interface InformationProp {
  from: string;
  to: string;
  date: string;
  accountIdFrom: string;
  accountIdTo: string;
  amount: string;
  bank: "bg" | "kasikorn" | "bangkok" | "krungthai";
}

const App = () => {
  const [, setLocation] = useLocation();
  return (
    <>
    asd
    </>
  );
};

export default App;
