// Modules
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

dotenv.config({ path: "./config.env" });
const userRouter = require("./Routes/userRoutes");
const messageRouter = require("./Routes/messageRoutes");
const groupRouter = require("./Routes/groupRoutes");
const sequelize = require("./utils/database");
const User = require("./models/userModel");
const Message = require("./models/messageModel");
const Group = require("./models/groupModel");
const userGroup = require("./models/userGroup");
const app = express();

app.use(
  cors({
    origin: "http://127.0.0.1:8080",
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/group", groupRouter);

User.hasMany(Message);
Message.belongsTo(User);

User.belongsToMany(Group, { through: userGroup });
Group.belongsToMany(User, { through: userGroup });

sequelize
  .sync()
  .then((res) => {
    app.listen(process.env.PORT, () => {
      console.log(`App running on ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(JSON.stringify(err));
    console.log(err.message);
  });
