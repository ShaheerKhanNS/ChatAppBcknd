const Message = require("../models/messageModel");
const { Op } = require("sequelize");

// exports.createMessage = async (req, res) => {
//   try {
//     const { message } = req.body;
//     console.log(message);
//     await Message.create({
//       message,
//       userId: req.user.id,
//       groupid: 1,
//     });
//     res.status(200).json({
//       status: "success",
//     });
//   } catch (err) {
//     console.log(JSON.stringify(err));
//     res.status(500).json({
//       status: "fail",
//     });
//   }
// };

// We had updated our app so lets leave the old code behind and work on new code

exports.createMessage = async (req, res) => {
  try {
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
    console.log(JSON.stringify(err));
    res.status(500).json({
      status: "fail",
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
      limit: 15,
      order: [["updatedAt", "ASC"]],
      where: {
        groupId,
      },
      attributes: ["userName", "message"],
    });

    res.status(200).json({
      status: "success",
      data: messages,
    });
  } catch (err) {
    console.log(JSON.stringify(err));
    res.status(500).json({
      status: "fail",
    });
  }
};
