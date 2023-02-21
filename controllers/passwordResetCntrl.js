const User = require("../models/userModel");
const PasswordModel = require("../models/forgotPasswordModel");
const Sib = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const URL = "http://127.0.0.1:3000";

exports.passwordResetMail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (user) {
      const id = uuidv4();
      await PasswordModel.create({
        id,
        userId: user.id,
        isActive: true,
      });

      const client = Sib.ApiClient.instance;
      const apiKey = client.authentications["api-key"];
      apiKey.apiKey = process.env.MAIL_API_KEY;

      const tranEmailApi = new Sib.TransactionalEmailsApi();

      const sender = {
        email: "khanshaheer43@gmail.com",
        name: "Sha Fintech",
      };

      const recievers = [
        {
          email: email,
        },
      ];

      tranEmailApi
        .sendTransacEmail({
          sender,
          to: recievers,
          subject: "Password reset link",
          textContent: `Please use this link for changing your password `,
          htmlContent: `<h3>Reset Your Password</h3>
                      <a href="${URL}/api/v1/password/resetPassword/${id}">Click here </a>                     `,
        })
        .then(() => {
          res.status(202).json({
            status: "success",
            message:
              "Password reset link has send to you via email successfully",
          });
        })
        .catch((err) => {
          throw new Error(err);
        });
    } else {
      res.status(404).json({
        status: "fail",
        message: "user not found!",
      });
    }
  } catch (err) {
    console.log(JSON.stringify(err));
  }
};

exports.resetPasswordPage = async (req, res) => {
  try {
    const id = req.params.id;

    const forgotpasswordUser = await PasswordModel.findOne({
      where: {
        id,
      },
    });

    if (forgotpasswordUser.isActive === true) {
      await forgotpasswordUser.update({ isActive: false });
      await forgotpasswordUser.save();

      res.status(200).send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="icon"
      type="image/png"
      href="https://img.icons8.com/color/256/weixing.png"
    />
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD"
      crossorigin="anonymous"
    />
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN"
      crossorigin="anonymous"
    ></script>
    <title>Reset Password</title>
  </head>
  <body style="background-color: #b2f2bb">
    <div style="margin-top: 135px; width: 1016px" class="container">
      <label style="color: dodgerblue" for="password" class="form-label"
        >Password:</label
      >
      <input
        id="password"
        type="password"
        class="form-control"
        required
        placeholder="Type Your new password here......."
      />
      <button
        style="margin-top: 10px"
        id="newPasswordSendBtn"
        class="btn btn-outline-success"
      >
        Send
      </button>
    </div>
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.3.2/axios.min.js"
      integrity="sha512-NCiXRSV460cHD9ClGDrTbTaw0muWUBf/zB/yLzJavRsPNUl9ODkUVmUHsZtKu17XknhsGlmyVoJxLg/ZQQEeGA=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    ></script>
    <script>
      const btn = document.getElementById("newPasswordSendBtn");
      btn.addEventListener("click", async () => {
        try {
          const password = document.getElementById("password").value;
          if (password) {
            const response = await axios({
              method: "POST",
              url: "${URL}/api/v1/password/updatePassword/${id}",
              data: { password },
            });
             alert(response.data.message)
             window.location.replace("${URL}/login/login.html")
          } else {
            alert("Please provide password");
          }
        } catch (err) {
          alert(err.message);
        }
      });
    </script>
    
  </body>
</html>
`);
    } else if (forgotpasswordUser.isActive === false) {
      res.redirect(`${URL}/error/error.html`);
    }
  } catch (err) {
    console.log(err);
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const id = req.params.id;
    const forgotPassword = await PasswordModel.findOne({
      where: {
        id,
      },
    });

    const user = await User.findOne({
      where: {
        id: forgotPassword.userId,
      },
    });

    bcrypt.hash(password, 12, async (err, hash) => {
      await user.update({ password: hash });
      await user.save();
    });

    res.status(200).json({
      status: "success",
      message: "password updated successfully",
    });
  } catch (err) {
    console.log(err);
  }
};
