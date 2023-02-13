// Modules
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");

dotenv.config({ path: "./config.env" });
const userRouter = require("./Routes/userRoutes");
const sequelize = require("./utils/database");
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1/users", userRouter);

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
