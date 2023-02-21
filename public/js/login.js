const btnLogin = document.getElementById("login");
const URL = "http://127.0.0.1:3000";

btnLogin.addEventListener("click", async (e) => {
  try {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email && password) {
      const response = await axios({
        method: "POST",
        url: `${URL}/api/v1/users/login`,
        data: {
          email,
          password,
        },
      });

      if (response.data.status === "success") {
        // console.log(response.data.token);
        localStorage.setItem("token", response.data.token);
        alert(response.data.message);
        window.location.replace(
          "http://127.0.0.1:3000/welcomepage/welcomePage.html"
        );
      }
    } else {
      alert("please provide your email and password to login❗");
    }
  } catch (err) {
    document.body.innerHTML += `<p class="container error">${err.message}</p>`;
  }
});

// *********************************************************//

// Password reset front-end

const forgotpasswordlink = document.getElementById("forgotpassword");
const subContainer = document.getElementById("sub-container");
const mainContainer = document.getElementById("main-container");

const closePasswordContainer = document.getElementById(
  "close-password-container"
);

forgotpasswordlink.addEventListener("click", (e) => {
  e.preventDefault();
  subContainer.classList.remove("password-reset-div");
  mainContainer.classList.add("password-reset-div");
});

closePasswordContainer.addEventListener("click", (e) => {
  e.preventDefault();

  subContainer.classList.add("password-reset-div");
  mainContainer.classList.remove("password-reset-div");
});

// Password reset mail;

const restBtn = document.getElementById("reset-password");

restBtn.addEventListener("click", async (e) => {
  try {
    e.preventDefault();
    const email = document.getElementById("email-passwordReset").value;

    if (email) {
      const response = await axios({
        method: "POST",
        url: `${URL}/api/v1/password/sendmail`,
        data: { email },
      });

      response.status === 202
        ? alert("Password rest link have send to your mail")
        : alert("Something went wrong");
      document.getElementById("email-passwordReset").value = "";
    } else {
      alert("Please provide the mail id");
    }
  } catch (err) {
    console.log(err);
  }
});
