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
    // Before adding any memmbers we need to validate whether he has the rights to do so by checking he is a admin of the group

    const { groupName, email, isAdmin } = req.body;
    //  check whether the user and group exist and also need to check whether the user is already a member in the group;if already a member update the admin status

    const user = await User.findOne({ where: { email } });
    const group = await Group.findOne({ where: { groupName } });

    const adminStatus = await UserGroup.findOne({
      where: {
        admin: true,
        userId: req.user.id,
        groupId: group.id,
      },
    });

    if (!adminStatus) {
      console.log("Unauthorized");
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized",
      });
    }

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

    await usergroup.update(
      { admin: isAdmin },
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

exports.deleteUser = async (req, res) => {
  try {
    const { groupName, email } = req.body;
    const group = await Group.findOne({
      where: {
        groupName,
      },
    });

    const userId = +req.user.id; //Id of the logged in user
    const groupId = group.id;

    // Check whether the current user has permission to remove
    const permissionStatus = await UserGroup.findOne({
      where: {
        admin: true,
        groupId,
        userId,
      },
    });

    if (permissionStatus) {
      const userToBeRemoved = await User.findOne({ where: { email } });

      if (!userToBeRemoved)
        return res.status(400).json({
          status: "fail",
          message: "Please check the email-id of the user you provided",
        });

      const removedStatus = await UserGroup.destroy({
        where: {
          userId: userToBeRemoved.id,
        },
      });

      if (removedStatus) {
        return res.send(200).json({
          status: "success",
          message: "user removed successfully",
        });
      } else {
        return res.status(400).json({
          status: "fail",
          message: "user not in the group",
        });
      }
    }
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getAllGroups = async (req, res) => {
  try {
    // Using sequelize magic functions which is available because we defined a relation between the table.
    const groups = await req.user.getGroups({
      attributes: ["id", "groupName"],
    });

    res.status(200).json({
      status: "success",
      data: groups,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
    });
  }
};

// Which gets all the group in which the user is admin
exports.getAdminGroups = async (req, res) => {
  try {
    const groups = await User.findOne({
      where: { id: req.user.id },
      include: [
        {
          model: Group,
          through: {
            where: {
              admin: true,
            },
          },
        },
      ],
    });

    res.status(200).json({
      status: "success",
      data: groups,
    });
  } catch (err) {
    console.log(JSON.stringify(err));
  }
};
