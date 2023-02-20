const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");
const crypto = require("crypto");

// *********************************
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const bucketName = process.env.AWS_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3({
  region: "ap-northeast-1",
  accessKeyId,
  secretAccessKey,
});

const s31 = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region: "ap-northeast-1",
});

// uploads a file to s3

const uniqueName = (bytes = 32) => {
  crypto.randomBytes(bytes).toString("hex");
};

exports.uploadFile = async (file) => {
  try {
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      // Key: file.filename,
      Key: file.filename,
    };

    return s3.upload(uploadParams).promise();
  } catch (err) {
    console.log(`Iam in uploading s3 service`, err);
  }
};

exports.uploadFileS3 = async (file) => {
  try {
    const params = {
      Bucket: bucketName,
      // Key: file.originalname,
      Key: uniqueName(),
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s31.send(command);
  } catch (err) {
    console.log(`I am in new upload ${err}`);
  }
};
