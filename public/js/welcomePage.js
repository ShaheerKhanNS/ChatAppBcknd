//  btnCreateGroup is an Btn element used to show group creation form

const btnCreateGroup = document.getElementById("createGroup");
const btnLogout = document.getElementById("logout");
const btnClose = document.getElementById("close");

//  btngroupCreate takes the details for group creation and do a axios POST call.
const btngroupCreate = document.getElementById("create-group");
const editGroupBtn = document.getElementById("editGroup-display");
const editCloseBtn = document.getElementById("closeBtn");
const addUserBtn = document.getElementById("btn-add-user");
const dltUserBtn = document.getElementById("btn-dlt-user");

const token = localStorage.getItem("token");
// const url = "http://127.0.0.1:3000";
const url = `http://35.78.245.211:3000`;

const socket = io(`${url}`);

// Elements
const formEL = document.getElementById("form-el");
const divEl = document.getElementById("grp-modify");
const groupContainer = document.querySelector(".box-group");
const msgDsplBox = document.getElementById("group-message-div");

btnCreateGroup.addEventListener("click", (e) => {
  e.preventDefault();
  formEL.classList.remove("card-model");
});

btnClose.addEventListener("click", (e) => {
  e.preventDefault();
  formEL.classList.add("card-model");
});

btnLogout.addEventListener("click", (e) => {
  e.preventDefault();
  alert("Are you sure you want to logout😥");
  localStorage.clear();
  // window.location.replace("http://127.0.0.1:8080/html/login.html");
  window.location.replace(`${url}/chat/login/login.html`);
});

btngroupCreate.addEventListener("click", async (e) => {
  try {
    e.preventDefault();
    const groupName = document.getElementById("groupname").value;
    if (groupName) {
      await axios({
        method: "POST",
        url: `${url}/api/v1/group/creategroup`,
        headers: { Authorization: token },
        data: { groupName },
      });
      document.getElementById("groupname").value = "";
      alert("Group Created successfully");
    } else {
      alert("Please enter your group name");
    }
  } catch (err) {
    console.log(`I am in group creating error block`, JSON.stringify(err));
  }
});

editGroupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  alert(
    "Before adding your friends to group make sure that they have signed up! Use their email-id to add them on your group🤟"
  );
  divEl.classList.remove("card-model");
});

editCloseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  divEl.classList.add("card-model");
});

const clearFields = () => {
  document.getElementById("groupname-add").value = document.getElementById(
    "email-joinee"
  ).value = "";
  document.getElementById("isAdmin").checked = false;
};

// Add user

addUserBtn.addEventListener("click", async (e) => {
  try {
    e.preventDefault();
    const groupName = document.getElementById("groupname-add").value;
    const email = document.getElementById("email-joinee").value;
    const isAdmin = document.getElementById("isAdmin").checked;

    const response = await axios({
      method: "POST",
      url: `${url}/api/v1/group/adduser`,
      headers: { Authorization: token },
      data: {
        groupName,
        email,
        isAdmin,
      },
    });

    if (response.status === 200) {
      alert("User added to your group");
      clearFields();
    } else if (response.status === 201) {
      alert("User status updated");
      clearFields();
    }
  } catch (err) {
    alert(err.response.data.message);
  }
});

// DeleteUser

dltUserBtn.addEventListener("click", async (e) => {
  try {
    e.preventDefault();
    const groupName = document.getElementById("groupname-add").value;
    const email = document.getElementById("email-joinee").value;

    const response = await axios({
      method: "POST",
      url: `${url}/api/v1/group/deleteuser`,
      headers: { Authorization: token },
      data: {
        groupName,
        email,
      },
    });
  } catch (err) {
    alert(err.response.data.message);
  }
});

const groups = async () => {
  try {
    const groups = await axios({
      method: "GET",
      url: `${url}/api/v1/group`,
      headers: { Authorization: token },
    });

    groups.data.data.forEach((group) => {
      renderGroups(group.groupName, group.id);
    });
  } catch (err) {
    console.log(`I am in groups error block ${JSON.stringify(err)}`);
  }
};

// Showing User the group he belongs to.....
groups();

// Getting all the groups in which user is admin

const adminGroups = async () => {
  try {
    const adminGroups = await axios({
      method: "GET",
      url: `${url}/api/v1/group/admin`,
      headers: { Authorization: token },
    });

    adminGroups.data.data.groups.forEach((group) => {
      renderAdminGroups(group.groupName, group.id);
    });
  } catch (err) {
    console.log(err);
  }
};

adminGroups();

const renderGroups = (groupName, id) => {
  const template = `<button style="margin-top: 10px;" data-id="${id}"  class="btn btn-outline-secondary" >${groupName}</button>`;

  return (groupContainer.innerHTML += template);
};

const renderAdminGroups = (groupName, id) => {
  const adminGroupContainer = document.getElementById("admin-group-list");
  const template = `<button
              style="margin-bottom: 10px"
              class="btn btn-outline-dark btn-sm"
              data-id="${id}"
              disabled
            >
             ${groupName}
            </button>`;
  return (adminGroupContainer.innerHTML += template);
};

// Buttons and Elements for chat container
// Mission to integrate the group chat field here so that user will not be redirected to another page.

const chatContainerBox = document.getElementById("chat-container-box");
const closechatBtn = document.getElementById("close-chatbox");

//  Closing Chatbox

closechatBtn.addEventListener("click", (e) => {
  e.preventDefault();
  chatContainerBox.classList.remove("chat-container");
  chatContainerBox.classList.add("card-model");
  closechatBtn.classList.add("card-model");

  // For socket optimization we make sure that our current user is not available on any groups

  groupId = undefined;
});

// Rendering Messages Since we have allowed users to send photos we need to consider that also

const renderImage = (userName, image) => {
  const template = `<div id="group-message-div" class="chat-messages">
            <div class="message">
              <div class="message-author">${userName}</div>
              <img
                class="chat-message-img"
                src=${image}
                alt="Image sent by ${userName}"
              />
            </div>`;
  msgDsplBox.innerHTML += template;
};

const renderMessage = (userName, message) => {
  const template = `<div class="message">
              <div class="message-author">${
                userName.charAt(0).toUpperCase() + userName.slice(1)
              }</div>
              <div class="message-text">${message}</div>
            </div>`;

  msgDsplBox.innerHTML += template;
};

// Function to check whether the incoming message is url; We also need to look only for our urls so that our users can send other urls without eny errors

const messageRender = (data) => {
  try {
    const url = new URL(data.message);
    if (url.hostname === "chatapp1.s3.ap-northeast-1.amazonaws.com") {
      renderImage(data.userName, data.message);
    } else {
      renderMessage(data.userName, data.message);
    }
  } catch (err) {
    renderMessage(data.userName, data.message);
  }
};

// Retriving messages

const retriveMessages = async () => {
  try {
    const messages = await axios({
      method: "GET",
      url: `${url}/api/v1/message/${groupId}`,
      headers: { Authorization: token },
    });

    // This is used to display the name of the group in the chat-box head
    const grpName = document.getElementById("group-name");
    grpName.textContent = groupNameRender;
    // To remove the previous clutter
    msgDsplBox.innerHTML = "";

    messages.data.data.forEach((data) => {
      messageRender(data);
    });
  } catch (err) {
    console.log(`I am in error block of retriving messages ${err}`);
  }
};

// Getting the groupId we are intrested in!

let groupId;
let groupNameRender;
groupContainer.addEventListener("click", (e) => {
  groupId = e.target.dataset.id;
  groupNameRender = e.target.textContent;

  // Frontend design
  closechatBtn.classList.remove("card-model");
  chatContainerBox.classList.remove("card-model");
  chatContainerBox.classList.add("chat-container");
  retriveMessages();
});

// Important task Sending message from front end on a selected group. For that i have added a onsubmit sendMessage function in the button element

const sendMsgBtn = document.getElementById("btn-sendMessage");

sendMsgBtn.addEventListener("click", async (e) => {
  try {
    // Currently we will allow only users either to send a text message or image at a time!
    e.preventDefault();

    const form = new FormData();
    form.append("message", document.getElementById("groupMessage").value);
    form.append("image", document.getElementById("image").files[0]);
    form.append("groupId", groupId);

    const response = await axios({
      method: "POST",
      url: `${url}/api/v1/message`,
      headers: { Authorization: token },
      data: form,
    });

    socket.emit("message-send", groupId);

    if (response.status === 200) {
      document.getElementById("form-data").reset();
    } else {
      alert("Something went wrong try aftersometime");
    }
  } catch (err) {
    console.log(
      `I am in error block of sending message ${JSON.stringify(err)}`
    );
  }
});

// Using socket.io for realtime working need to call the server when only any user send a message;

socket.on("message-recieved", (id) => {
  if (groupId == +id) retriveMessages();
});
