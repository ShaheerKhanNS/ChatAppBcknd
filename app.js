// Modules
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

dotenv.config({ path: "./config.env" });
const userRouter = require("./Routes/userRoutes");
const messageRouter = require("./Routes/messageRoutes");
const sequelize = require("./utils/database");
const User = require("./models/userModel");
const Message = require("./models/messageModel");
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

User.hasMany(Message);
Message.belongsTo(User);

sequelize
  .sync()
  .then((res) => {
    app.listen(process.env.PORT, () => {
      console.log(`App running on ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(JSON.stringify(err));
  });
