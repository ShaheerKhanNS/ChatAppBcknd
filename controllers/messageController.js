const Message = require("../models/messageModel");
const multer = require("multer");

const { uploadFileS3 } = require("../s3services");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.uploadImage = upload.single("image");

exports.createMessage = async (req, res) => {
  try {
    const file = req.file;

    const newImage = await uploadFileS3(file);
    console.log(newImage);
    const { message, groupId } = req.body;

    await req.user.createMessage({
      message,
      groupId,
      userName: req.user.name,
    });

    res.status(200).json({
      status: "success",
      message: "Message created successfully",
    });
  } catch (err) {
    console.log(`Iam in createmessage errorblock`, err);
    res.status(500).json({
      status: "fail",
      data: err,
    });
  }
};

// exports.getMessage = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const lastMessage = +req.query.lastmessageid || -1;

//     const messages = await Message.findAll({
//       where: {
//         id: { [Op.gt]: lastMessage },

//         userId,
//       },
//     });

//     res.status(200).json({
//       status: "success",
//       data: messages,
//     });
//   } catch (err) {
//     console.log("I am in errorblock");
//     console.log(JSON.stringify(err));
//     res.status(500).json({
//       status: "fail",
//     });
//   }
// };

exports.getMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    console.log(typeof groupId, groupId, req.params);
    const messages = await Message.findAll({
      limit: 10,
      order: [["updatedAt", "DESC"]],
      where: {
        groupId,
      },
      attributes: ["userName", "message"],
    });

    res.status(200).json({
      status: "success",
      data: messages.reverse(), // To get the message in correct order
    });
  } catch (err) {
    console.log(JSON.stringify(err));
    res.status(500).json({
      status: "fail",
    });
  }
};
