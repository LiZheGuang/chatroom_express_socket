let express = require('express')
var app = express()
var bodyParser = require("body-parser");
var cookiePareser = require('cookie-parser')
var path = require('path');
var http = require('http')
var server = http.createServer(app)

var io = require('socket.io').listen(server);

var users = {};//存储在线用户列表的对象

io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world', content: "欢迎来到武林聊天室" });
    socket.on('serverEvent', function (data) {
        console.log(data);
        io.sockets.emit('groupChat', { name: data.name, content: data.content });
    });

    //有人上线
    socket.on('online', function (data) {
        //将上线的用户名存储为 socket 对象的属性，以区分每个 socket 对象，方便后面使用
        socket.name = data.user;
        //users 对象中不存在该用户名则插入该用户名
        if (!users[data.user]) {
            users[data.user] = data.user;
        }
        //向所有用户广播该用户上线信息
        io.sockets.emit('online', { users: users, user: data.user });
    });
});




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookiePareser());
app.use(express.static('public'))



server.listen(8080, () => {
    console.log('server go !')
});


app.get('/', (req, res) => {
    if (req.cookies.user == null) {
        res.redirect('/signin');
    } else {
        console.log(users)
        res.sendfile('client/index.html');
    }
})
app.get('/signin', (req, res) => {
    res.sendfile('client/signin.html')
})

app.post('/signin', function (req, res) {
    if (users[req.body.name]) {
        //存在，则不允许登陆
        res.redirect('/signin');
    } else {
        console.log(req.body)
        //不存在，把用户名存入 cookie 并跳转到主页
        res.cookie("user", req.body.name, { maxAge: 1000 * 60 * 60 * 24 * 30 });
        res.redirect('/');
    }
});



