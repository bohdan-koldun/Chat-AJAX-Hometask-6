(function () {
  let nameInput = document.getElementById('usernameInput');
  let nicknameInput = document.getElementById('nicknameInput');
  let inputMessage = document.getElementById('inputMessage');
  let loginButton = document.getElementById('button-enter');
  let sendMsgButton = document.getElementById('send-msg-btn');
  let messagesDiv = document.getElementById('messages');
  let userDiv = document.getElementById('users');
  let loginArea = document.getElementsByClassName('login')[0];
  let chatArea = document.getElementsByClassName('chat')[0];

  let userName = 'User Name';
  let userNickname = 'nickname';

  //login in the Chat
  loginButton.onclick = () => {
    userName = nameInput.value || 'User Name';
    userNickname = nicknameInput.value || 'nickname' + Math.floor(Math.random() * 100);
    loginArea.style.display = 'none';
    chatArea.style.display = 'block';

    let user = {
      name: userName,
      nickname: userNickname
    };

    ajaxRequest({
      method: 'POST',
      url: '/users',
      data: user
    });

    setInterval(function () { getData(); }, 1000);
  };

  //send message to the Chat
  sendMsgButton.onclick = () => {
    let data = {
      name: userName,
      nickname: userNickname,
      message: inputMessage.value,
      time: new Date().toUTCString()
    };

    // send new chat message event to the server
    ajaxRequest({
      method: 'POST',
      url: '/messages',
      data: data
    });

    inputMessage.value = '';
  };



  let ajaxRequest = (options) => {
    let url = options.url || '/';
    let method = options.method || 'GET';
    let callback = options.callback || function () { };
    let data = options.data || {};
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.open(method, url, true);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(JSON.stringify(data));

    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.status == 200 && xmlHttp.readyState === 4) {
        callback(xmlHttp.responseText);
      }
    };

  };


  let getUsers = () => {
    ajaxRequest({
      url: '/users',
      method: 'GET',
      callback: (users) => {
        users = JSON.parse(users);
        userDiv.innerHTML = '';
        for (var i in users) {
          if (users.hasOwnProperty(i)) {
            displayOneUser(users[i]);
          }
        }
      }
    });

  };


  let getMessages = () => {
    ajaxRequest({
      url: '/messages',
      method: 'GET',
      callback: (msg) => {
        msg = JSON.parse(msg);
        messages.innerHTML = '';
        for (var i in msg) {
          if (msg.hasOwnProperty(i)) {
            displayOneMsg(msg[i], userNickname);
          }
        }
      }
    });

  };

  let getData = () => {
    getMessages();
    getUsers();
  };



  //display Message
  function displayOneMsg(msg, nickname) {
    if (msg.message != '') {
      let elem = document.createElement('div');
      if (msg.message.indexOf('@' + nickname + ' ') !== -1) {
        elem.style.backgroundColor = "#dadada";
      }

      elem.innerHTML = `<span>${msg.name} <b>@${msg.nickname}</b><br> <i>${msg.time} </i></span><text>${msg.message}</text>`;
      messagesDiv.appendChild(elem);
    }
  }

  //display User
  function displayOneUser(user) {
    let elem = document.createElement('div');
    elem.innerHTML = `<li><i class="fa fa-user"></i>${user.name} <br><b>@${user.nickname}</b></li>`;
    userDiv.appendChild(elem);

  }


})();