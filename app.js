let express = require('express')
var bodyParser = require("body-parser");
var cookiePareser = require('cookie-parser')
var app = express()

var server = require('http').createServer(app)
var io = require('socket.io').listen(server);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookiePareser());


server.listen(8080);

var users = {};//存储在线用户列表的对象

app.get('/',(req,res)=>{
    if (req.cookies.user == null) {
        res.redirect('/signin');
      } else {
        res.sendfile('client/index.html');
      }
})
app.get('/signin',(req,res)=>{
    res.sendfile('client/signin.html')
})

app.post('/signin', function (req, res) {
    if (users[req.body.name]) {
      //存在，则不允许登陆
      res.redirect('/signin');
    } else {
      console.log(req.body)
      //不存在，把用户名存入 cookie 并跳转到主页
      res.cookie("user", req.body.name, {maxAge: 1000*60*60*24*30});
      res.redirect('/');
    }
  });
  

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world',content:"欢迎来到武林聊天室" });
  socket.on('serverEvent', function (data) {
    console.log(data);
    io.sockets.emit('groupChat', { name: data.name,content:data.content});    
  });
});

