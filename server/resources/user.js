const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");
const bcrypt = require("bcryptjs");
const { Users } = require("../schema");
const { hasRole } = require("../utlis");
const { body, validationResult } = require("express-validator");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const url_line_notification = "https://notify-api.line.me/api/notify";
const multer = require("multer");
const request = require("request");
const FormData = require("form-data");
const axios = require("axios");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, "file.png");
  },
});

let upload = multer({ storage: storage });

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.locale("th");
dayjs.tz.setDefault("Asia/Bangkok");

module.exports = function (api) {
  api.post("/sending", upload.single("img"), async (req, res) => {
    const file = req.file;
    const token = JSON.parse(req.body.token)
    for (let x in token) {
    const formData = new FormData();
    formData.append("message", "_");
    formData.append("imageFile", fs.createReadStream(file.path));
    var config = {
      method: "POST",
      url: url_line_notification,
      headers: {
        "content-type": "multipart/form-data",
        Authorization: "Bearer " + token[x].token,
      },
      data: formData,
    };

    axios(config)
    }

    return res.status(200).success("");
  });
};
