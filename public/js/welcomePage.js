//  btnCreateGroup is an Btn element used to show group creation form
const btnCreateGroup = document.getElementById("createGroup");
const btnLogout = document.getElementById("logout");
const btnClose = document.getElementById("close");

//  btngroupCreate takes the details for group creation and do a axios POST call.
const btngroupCreate = document.getElementById("create-group");
const editGroupBtn = document.getElementById("editGroup-display");
const editCloseBtn = document.getElementById("closeBtn");
const addUserBtn = document.getElementById("btn-add-user");

const token = localStorage.getItem("token");

const URL = "http://127.0.0.1:3000";

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
  window.location.replace(`${URL}/login/login.html`);
});

btngroupCreate.addEventListener("click", async (e) => {
  try {
    e.preventDefault();
    const groupName = document.getElementById("groupname").value;
    if (groupName) {
      await axios({
        method: "POST",
        url: `${URL}/api/v1/group/creategroup`,
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

addUserBtn.addEventListener("click", async (e) => {
  try {
    e.preventDefault();
    const groupName = document.getElementById("groupname-add").value;
    const email = document.getElementById("email-joinee").value;
    const isAdmin = document.getElementById("isAdmin").checked;

    const response = await axios({
      method: "POST",
      url: `${URL}/api/v1/group/adduser`,
      headers: { Authorization: token },
      data: {
        groupName,
        email,
        isAdmin,
      },
    });

    console.log(response.status);

    if (response.status === 200) {
      alert("User added to your group");
      clearFields();
    } else if (response.status === 201) {
      alert("User status updated");
      clearFields();
    }
  } catch (err) {
    console.log(`I am in adduser error block ${JSON.stringify(err)}`);
  }
});

const groups = async () => {
  try {
    const groups = await axios({
      method: "GET",
      url: `${URL}/api/v1/group`,
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

const renderGroups = (groupName, id) => {
  const template = `<button style="margin-top: 10px;" data-id="${id}"  class="btn btn-outline-secondary" >${groupName}</button>`;

  return (groupContainer.innerHTML += template);
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
});

// Rendering Messages

const renderMessage = (userName, message) => {
  const template = `<div class="message">
              <div class="message-author">${
                userName.charAt(0).toUpperCase() + userName.slice(1)
              }</div>
              <div class="message-text">${message}</div>
            </div>`;

  msgDsplBox.innerHTML += template;
};

// Retriving messages

const retriveMessages = async () => {
  try {
    const messages = await axios({
      method: "GET",
      url: `${URL}/api/v1/message/${groupId}`,
      headers: { Authorization: token },
    });

    // This is used to display the name of the group in the chat-box head
    const grpName = document.getElementById("group-name");
    grpName.textContent = groupNameRender;
    // To remove the previous clutter
    msgDsplBox.innerHTML = "";
    messages.data.data.forEach((data) => {
      renderMessage(data.userName, data.message);
    });
  } catch (err) {
    console.log(
      `I am in error block of retriving messages ${JSON.stringify(err)}`
    );
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

sendMsgBtn.addEventListener("click", async () => {
  try {
    const message = document.getElementById("groupMessage").value;
    console.log(`Button clicked on group ${groupId}`, message);

    const response = await axios({
      method: "POST",
      url: `${URL}/api/v1/message`,
      headers: { Authorization: token },
      data: {
        message,
        groupId,
      },
    });

    if (response.status === 200) {
      document.getElementById("groupMessage").value = "";
    } else {
      alert("Something went wrong try aftersometime");
    }
  } catch (err) {
    console.log(
      `I am in error block of sending message ${JSON.stringify(err)}`
    );
  }
});
