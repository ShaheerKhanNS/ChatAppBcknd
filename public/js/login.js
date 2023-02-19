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
