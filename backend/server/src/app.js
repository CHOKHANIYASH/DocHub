require("dotenv").config();
const app = require("express")();
const cors = require("cors");
const bodyParser = require("body-parser");
const { AppError } = require("./middleware/middleware");
const UserRoutes = require("./routes/userRoutes");
const ImageRoutes = require("./routes/imageRoutes");
const DocumentRoutes = require("./routes/documentRoutes");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("Welcome to the DocHub API ecs version 1.0.0");
});

app.get("/health", (req, res) => {
  res.send("ok health");
});
console.log("Hello");
app.use("/user", UserRoutes);
app.use("/image", ImageRoutes);
app.use("/docs", DocumentRoutes);

const PORT = process.env.PORT || 5000;

app.use((err, req, res, next) => {
  console.log(err);
  if (err.name === "AppError") {
    res
      .status(err.status)
      .send({ success: false, message: err.message, data: {} });
    return;
  }
  res.status(err.status || 500).send({
    success: false,
    message: "Internal Server Error, try after some time",
    data: {},
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening at port:${PORT}`);
});

// module.exports.handler = serverless(app);
