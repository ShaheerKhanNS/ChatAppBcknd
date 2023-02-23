const crypto = require("crypto");
const sharp = require("sharp");

// *********************************
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

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

//  We are using a secured way of uploading images and showing to the user

// 1) First we upload to s3 bucket and on the second step we use a signed url and gives to the client this way its more secured

const uniqueName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");
// uploads a file to s3

const imageName = uniqueName();
exports.uploadFileS3 = async (file) => {
  try {
    const buffer = await sharp(file.buffer)
      .resize({ height: 350, width: 350, fit: "contain" })
      .toBuffer();
    const params = {
      Bucket: bucketName,
      Key: imageName,
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

// Function to generate a signed url

exports.signedUrl = async () => {
  try {
    const getObjectParams = { Bucket: bucketName, Key: imageName };

    const command = new GetObjectCommand(getObjectParams);

    const url = await getSignedUrl(s31, command, { expiresIn: 3600 });

    return url;
  } catch (err) {
    console.log(err);
  }
};
