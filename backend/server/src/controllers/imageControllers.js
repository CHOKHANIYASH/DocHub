const { s3Client } = require("../aws/client");
const { PutObjectCommand } = require("@aws-sdk/client-s3");

const getObjectUrl = async ({ Bucket, Key }) => {
  const bucketName = Bucket;
  const s3ObjectUrl = `https://${bucketName}.s3.amazonaws.com/${Key}`;
  return s3ObjectUrl;
};
const upload = async ({ Bucket, Key, Image, ContentType }) => {
  const command = new PutObjectCommand({
    Bucket,
    Key,
    Body: Image,
    ContentType,
  });
  const response = await s3Client.send(command);
  const imageUrl = await getObjectUrl({ Bucket, Key });
  return {
    status: 200,
    response: {
      success: true,
      message: "Image uploaded successfully",
      data: { imageUrl },
    },
  };
};
module.exports = { upload };
