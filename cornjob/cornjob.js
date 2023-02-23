const corn = require("cron");
const { Op } = require("sequelize");
const Message = require("../models/messageModel");
const ArchivedMessage = require("../models/archivedChats");

// This runs every night at midnight
exports.job = new corn.CronJob("0 0 * * *", async () => {
  try {
    const timeStamp = Date.now();
    const oneDayAgo = new Date(timeStamp - 24 * 60 * 60 * 1000);

    // Finding all chats more than one day

    const oldChats = await Message.findAll({
      where: {
        createdAt: {
          [Op.lt]: oneDayAgo,
        },
      },
    });

    await Promise.all(
      oldChats.map(async (chat) => {
        const archivedChat = await ArchivedMessage.create({
          message: chat.message,
          groupId: chat.groupId,
          userName: chat.userName,
          userId: chat.userId,
          // To preserve the created at
          createdAt: chat.createdAt,
        });

        // Deleting the old chat

        await chat.destroy();
      })
    );
  } catch (err) {
    console.log(err);
  }
});
