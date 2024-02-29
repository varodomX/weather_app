const express = require("express");
const app = express();
const cors = require("cors");
const User = require("./resources/user");
const Backend = require("./resources/backend");
const { responser, auth } = require("./utlis.js");
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(responser);
app.use(auth);

const apiRoute = express.Router();
app.use("/v1", apiRoute);

User(apiRoute);
Backend(apiRoute);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
