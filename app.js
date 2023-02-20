// Modules
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

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
    origin: "http://127.0.0.1:3000",
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/group", groupRouter);
app.use((req, res) => {
  res
    .setHeader(
      "Content-Security-Policy",

      "script-src https://cdnjs.cloudflare.com/ajax/libs/axios/1.3.2/axios.min.js https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js http://127.0.0.1:3000/js/signup.js http://127.0.0.1:3000/js/login.js http://127.0.0.1:3000/js/welcomePage.js",
      "img-src  https://img.icons8.com/color/256/weixing.png"
    )
    .sendFile(path.join(__dirname, `public${req.url}`));
});

User.hasMany(Message);
Message.belongsTo(User);

User.belongsToMany(Group, { through: userGroup });
Group.belongsToMany(User, { through: userGroup });

sequelize
  .sync()
  .then((res) => {
    // Using socekt io to establish connection.

    const server = app.listen(process.env.PORT, () => {
      console.log(`App running on ${process.env.PORT}`);
      const io = require("socket.io")(server);

      io.on("connection", (socket) => {
        console.log(socket.id);
      });
    });
  })
  .catch((err) => {
    console.log(JSON.stringify(err));
    console.log(err.message);
  });
