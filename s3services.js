const crypto = require("crypto");
const sharp = require("sharp");

// *********************************
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const bucketName = process.env.AWS_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s31 = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region: "ap-northeast-1",
});

const uniqueName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");
// uploads a file to s3

exports.uploadFileS3 = async (file) => {
  try {
    const buffer = await sharp(file.buffer)
      .resize({ height: 1080, width: 1080, fit: "contain" })
      .toBuffer();
    const params = {
      Bucket: bucketName,
      Key: file.originalname,
      // Key: uniqueName(),
      Body: buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s31.send(command);
  } catch (err) {
    console.log(`I am in new upload ${err}`);
  }
};
