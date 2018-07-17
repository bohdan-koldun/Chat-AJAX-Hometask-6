let app = require('express')();
let server = require('http').createServer(app);
let bodyParser = require('body-parser');

let port = 3000;


let messages = [], users = [];

// Routing
app.use(bodyParser.json());

app.use(bodyParser.urlencoded());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/public/css/style.css', (req, res) => {
  res.sendFile(__dirname + '/public/css/style.css');
});

app.get('/public/script.js', (req, res) => {
  res.sendFile(__dirname + '/public/script.js');
});

app.get('/messages', (req, res) => {
  res.json(messages);
});

app.post('/messages', (req, res) => {
  saveNewMessage(req.body);
});

app.get('/users', (req, res) => {
  res.json(users);
});

app.post('/users', (req, res) => {
  addNewUser(req.body);
});




//save new message in the history function
function saveNewMessage(msg) {
  if (msg.message !== '') {
    messages.push(msg);
  }
  // FIFO
  if (messages.length > 100) {
    messages.shift();
  }
}

// add new user function
function addNewUser(user) {
  users.push(user);
}

// conect to server
server.listen(port, () => {
  console.log('Server listening at port %d', port);
});
