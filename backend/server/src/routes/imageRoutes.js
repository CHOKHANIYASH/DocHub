const router = require("express").Router();
const {
  handleAsyncError,
  AppError,
  upload,
} = require("../middleware/middleware");
const ImageControllers = require("../controllers/imageControllers");
const { v4: uuid } = require("uuid");
router.get("/", (req, res) => {
  try {
    res.status(200).send("Hello from Image routes");
  } catch (err) {
    throw err;
  }
});
router.post(
  "/upload",
  upload.array("images"),
  handleAsyncError(async (req, res) => {
    const images = req.files;
    console.log(images);
    let imageUrls = [];
    const Bucket = process.env.S3_BUCKET;
    for (let img of images) {
      const ContentType = img.mimetype;
      const Key = `${new Date().toISOString()}.${ContentType.split("/")[1]}`;
      const { status, response } = await ImageControllers.upload({
        Bucket,
        Key,
        Image: img.buffer,
        ContentType,
      });
      imageUrls.push(response.data.imageUrl);
    }
    res.status(200).send({
      suucess: true,
      message: "Upload Successfull",
      data: { imageUrls },
    });
  })
);

module.exports = router;
