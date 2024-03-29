// Modules
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const corn = require("cron");

// dotenv.config({ path: "./config.env" });
dotenv.config({ path: "./aws.env" });

// Routes
const userRouter = require("./Routes/userRoutes");
const messageRouter = require("./Routes/messageRoutes");
const groupRouter = require("./Routes/groupRoutes");
const passwordRouter = require("./Routes/passwordRoutes");

// Database and other utilities
const sequelize = require("./utils/database");
const { archiveChats } = require("./archivechats/archivechats");

// Models
const User = require("./models/userModel");
const Message = require("./models/messageModel");
const PasswordModel = require("./models/forgotPasswordModel");
const Group = require("./models/groupModel");
const userGroup = require("./models/userGroup");

// Starting app
const app = express();

// app.use(
//   cors({
//     origin: "http://127.0.0.1:3000",
//   })
// );
app.use(
  cors({
    origin: "http://35.78.245.211:3000",
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/group", groupRouter);
app.use("/api/v1/password", passwordRouter);

// app.use("/chat", (req, res) => {
//   res
//     .setHeader(
//       "Content-Security-Policy",

//       "script-src https://cdnjs.cloudflare.com/ajax/libs/axios/1.3.2/axios.min.js https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js http://127.0.0.1:3000/chat/js/signup.js http://127.0.0.1:3000/chat/js/login.js http://127.0.0.1:3000/chat/js/welcomePage.js http://127.0.0.1:3000/socket.io/socket.io.js",
//       "img-src  https://img.icons8.com/color/256/weixing.png"
//     )
//     .sendFile(path.join(__dirname, `public${req.url}`));
// });
app.use("/chat", (req, res) => {
  res
    .setHeader(
      "Content-Security-Policy",

      "script-src https://cdnjs.cloudflare.com/ajax/libs/axios/1.3.2/axios.min.js https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js http://35.78.245.211:3000/chat/js/signup.js http://35.78.245.211:3000/chat/js/login.js http://35.78.245.211:3000/chat/js/welcomePage.js http://35.78.245.211:3000/socket.io/socket.io.js",
      "img-src  https://img.icons8.com/color/256/weixing.png"
    )
    .sendFile(path.join(__dirname, `public${req.url}`));
});

// For handling routes which are not defined

User.hasMany(Message);
Message.belongsTo(User);

User.hasMany(PasswordModel);
PasswordModel.belongsTo(User);

User.belongsToMany(Group, { through: userGroup });
Group.belongsToMany(User, { through: userGroup });

sequelize
  .sync()
  .then((res) => {
    // Using socekt io to establish connection.

    const server = app.listen(process.env.PORT, () => {
      console.log(`App running on ${process.env.PORT}`);

      // In newer version of socket.io we need to use allowEO3 to true;default value is zero.In order to prevent unsupported protocol version.

      const io = require("socket.io")(server, {
        cors: {
          origin: ["http://35.78.245.211:3000"],
        },
        allowEIO3: true,
      });
      io.on("connection", (socket) => {
        socket.on("message-send", (groupId) => {
          io.emit("message-recieved", groupId);
        });
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });

// This runs every mid-night
const job = new corn.CronJob("00 00 00 * * *", () => {
  archiveChats();
});

job.start();
