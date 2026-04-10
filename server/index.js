const express = require("express");
const axios = require("axios");
const fs = require("fs");
const cron = require("node-cron");

const app = express();
const port = process.env.PORT || 4000;

// API URL ของ TMD
const API_URL = "https://data.tmd.go.th/api/Weather3Hours/V2/?uid=u63varodom2011&ukey=4e24bb2b6db8caf2e9ce637ec9d9a815&format=json";

// ฟังก์ชันดึงข้อมูลจาก API และบันทึกลงไฟล์ JSON
async function fetchWeatherData() {
  try {
    const response = await axios.get(API_URL);
    const data = response.data;

    // บันทึก JSON ลงไฟล์
    fs.writeFileSync("weather_data.json", JSON.stringify(data, null, 2));
    console.log("✅ ดึงข้อมูลสำเร็จ และบันทึกไฟล์แล้ว!");
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการดึงข้อมูล:", error.message);
  }
}

// ตั้งเวลาให้รันทุกชั่วโมง (0 นาทีของทุกชั่วโมง)
cron.schedule("0 * * * *", () => {
  console.log("⏳ กำลังดึงข้อมูลสภาพอากาศ...");
  fetchWeatherData();
});

// API เพื่อให้สามารถเข้าถึงข้อมูล JSON
app.get("/weather", (req, res) => {
  try {
    const data = fs.readFileSync("weather_data.json", "utf8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "ไม่พบข้อมูล" });
  }
});

// เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`🚀 Server started on port ${port}`);
  fetchWeatherData(); // ดึงข้อมูลทันทีเมื่อเริ่มระบบ
});
