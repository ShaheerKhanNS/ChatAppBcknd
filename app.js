const express = require("express");

const app = express();

app.post("/api/v1/users", (req, res) => {
  const { name, password, phonenumber, email } = req.body;
});

app.listen(3000, () => {
  console.log(`App running on 3000`);
});
