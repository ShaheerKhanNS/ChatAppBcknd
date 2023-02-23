// const URL = "http://127.0.0.1:3000";
// // Buttons
// const btnSend = document.getElementById("btn-submit");

// const token = localStorage.getItem("token");

// btnSend.addEventListener("click", async (e) => {
//   try {
//     e.preventDefault();
//     const message = document.getElementById("message").value;
//     if (message) {
//       await axios({
//         method: "POST",
//         url: `${URL}/api/v1/message`,
//         headers: { Authorization: token },
//         data: { message },
//       });
//       document.getElementById("message").value = "";
//     }
//   } catch (err) {
//     console.log(JSON.stringify(err));
//   }
// });

// const renderTemplate = (message) => {
//   const template = ` <div class="container send">
//           <p>${message}</p>
//         </div>`;
//   const chatBox = document.querySelector(".main_div");
//   return (chatBox.innerHTML += template);
// };

// const retrieveMessages = async () => {
//   try {
//     // To clear the previous clutter
//     const chatBox = document.querySelector(".main_div");
//     chatBox.innerHTML = "";
//     // LS Stands for local storage we are storing the message in local storage for better optimization
//     const messageLS = JSON.parse(localStorage.getItem("message"));
//     let lastmessageid;
//     if (messageLS) {
//       messageLS.forEach((data) => {
//         renderTemplate(data.message);
//       });
//       lastmessageid = messageLS[messageLS.length - 1].id;
//     }
//     const messages = await axios({
//       method: "GET",
//       url: `${URL}/api/v1/message?lastmessageid=${lastmessageid}`,
//       headers: { Authorization: token },
//     });

//     let mergedMessages;
//     if (messageLS) {
//       // Deleting old messages
//       if (messageLS.length >= 10) {
//         messageLS.splice(0, 3);
//       }

//       mergedMessages = [...messageLS, ...messages.data.data];
//     } else {
//       mergedMessages = [...messages.data.data];
//     }
//     console.log(mergedMessages, lastmessageid, messages);
//     localStorage.setItem("message", JSON.stringify(mergedMessages));
//   } catch (err) {
//     console.log("Iam error");
//     console.log(JSON.stringify(err));
//   }
// };

// window.addEventListener("DOMContentLoaded", retrieveMessages);
// // setInterval(retrieveMessages, 500);
