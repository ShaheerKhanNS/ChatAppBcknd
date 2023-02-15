const Message = require("../models/messageModel");
const Sequelize = require("sequelize");

const Op = Sequelize.Op;

exports.createMessage = async (req, res) => {
  try {
    const { message } = req.body;
    await Message.create({
      message,
      userid: req.user.id,
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
    const userid = req.user.id;

    const lastMessage = +req.query.lastmessageid || -1;
    console.log(lastMessage);
    const messages = await Message.findAll({
      where: {
        id: { [Op.gt]: lastMessage },

        userid,
      },
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
