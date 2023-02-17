const Message = require("../models/messageModel");
const { Op } = require("sequelize");

exports.createMessage = async (req, res) => {
  try {
    const { message } = req.body;
    console.log(message);
    await Message.create({
      message,
      userId: req.user.id,
      groupid: 1,
    });
    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    console.log(JSON.stringify(err));
    res.status(500).json({
      status: "fail",
    });
  }
};

exports.getMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const lastMessage = +req.query.lastmessageid || -1;

    const messages = await Message.findAll({
      where: {
        id: { [Op.gt]: lastMessage },

        userId,
      },
    });

    res.status(200).json({
      status: "success",
      data: messages,
    });
  } catch (err) {
    console.log("I am in errorblock");
    console.log(JSON.stringify(err));
    res.status(500).json({
      status: "fail",
    });
  }
};
