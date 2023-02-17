const Group = require("../models/groupModel");
const User = require("../models/userModel");
const UserGroup = require("../models/userGroup");

exports.createGroup = async (req, res) => {
  try {
    const { groupName } = req.body;

    await req.user.createGroup(
      {
        groupName,
      },
      { through: { admin: true } }
    );

    res.status(200).json({
      status: "success",
      message: "Group created successfully",
    });
  } catch (err) {
    console.log(JSON.stringify(err));
    res.status(500).json({
      status: "fail",
      message: "Internal server issue",
    });
  }
};

exports.addUserToGroup = async (req, res) => {
  try {
    const { groupName, email, isAdmin } = req.body;
    //  check whether the user and group exist and also need to check whether the user is already a member in the group;if already a member update the admin status

    const user = await User.findOne({ where: { email } });
    const group = await Group.findOne({ where: { groupName } });

    if (!user || !group) {
      return res.status(400).json({
        status: "fail",
        message: "user/group not found",
      });
    }

    const usergroup = await UserGroup.findOne({
      where: { userId: user.id, groupId: group.id },
    });

    if (!usergroup) {
      await UserGroup.create({
        userId: user.id,
        groupId: group.id,
        isAdmin,
      });
      return res.status(200).json({
        status: "success",
        message: "User added to group",
      });
    }

    usergroup.update(
      { isAdmin },
      {
        where: {
          userId: user.id,
          groupId: group.id,
        },
      }
    );
    res.status(201).json({
      status: "success",
      message: "User updated",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
