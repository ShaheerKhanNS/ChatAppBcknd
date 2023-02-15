const Message = require("../models/messageModel");

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
    const id = req.user.id;

    const messages = await Message.findAll({
      where: {
        userid: id,
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
