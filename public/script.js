(function () {
  let nameInput = document.getElementById('usernameInput');
  let nicknameInput = document.getElementById('nicknameInput');
  let inputMessage = document.getElementById('inputMessage');
  let counterMsg = document.getElementById('counter-msg');
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
    nameInput.value = '', nicknameInput.value = '';

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


  // request data function
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

  // get and update users data
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

  // get and update messages data
  let getMessages = () => {
    ajaxRequest({
      url: '/messages',
      method: 'GET',
      callback: (msg) => {
        msg = JSON.parse(msg);
        messages.innerHTML = '';
        let length = msg.length;
        for (var i in msg) {
          if (msg.hasOwnProperty(i)) {
            displayOneMsg(msg[i], userNickname, length);
          }
        }
      }
    });

  };


  //update all data
  let getData = () => {
    getMessages();
    getUsers();
  };



  //display Message
  function displayOneMsg(msg, nickname, length) {
    if (msg.message != '') {
      let elem = document.createElement('div');
      let regExp = new RegExp(`(^|\\s)@${nickname}(\\s|$)`);

      if (msg.message.search(regExp) !== -1) {
        elem.style.backgroundColor = "#dadada";
      }

      if (nickname == msg.nickname) {
        elem.innerHTML = `<text class="right-message">${msg.message}</text><span>${msg.name} <b>@${msg.nickname}</b><br> <i>${msg.time} </i></span>`;
        elem.style.gridTemplateColumns = '1fr 200px';
      }
      else {
        elem.innerHTML = `<span>${msg.name} <b>@${msg.nickname}</b><br> <i>${msg.time} </i></span><text>${msg.message}</text>`;
      }

      messagesDiv.appendChild(elem);
      counterMsg.innerHTML = length;

      //auto scroll to bottom
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
  }

  //display User
  function displayOneUser(user) {
    let elem = document.createElement('div');

    if (userNickname == user.nickname) {
      elem.innerHTML = `<li><i class="fa fa-user"></i>${user.name}&nbsp;<b>(me)</b><br><b>@${user.nickname}</b></li>`;
    }
    else {
      elem.innerHTML = `<li><i class="fa fa-user"></i>${user.name} <br><b>@${user.nickname}</b></li>`;
    }

    userDiv.appendChild(elem);
  }


})();