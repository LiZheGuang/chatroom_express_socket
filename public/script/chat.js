$(document).ready(function () {
    var socket = io('http://10.8.201.110:8080/');
    var from = $.cookie('user');//从 cookie 中读取用户名，存于变量 from
    var to = 'all';//设置默认接收对象为"所有人"
    //发送用户上线信号
    socket.emit('online', { user: from });
    socket.on('online', function (data) {
        //显示系统消息
        console.log(data)
        let usersMessage = $('#usersMessage')
        usersMessage.text(data.user + '用户上线了！大家快给掌声！')

        listName(data.users)
        // if (data.user != from) {
        //     var sys = '<div style="color:#f00">系统(' + now() + '):' + '用户 ' + data.user + ' 上线了！</div>';
        // } else {
        //     var sys = '<div style="color:#f00">系统(' + now() + '):你进入了聊天室！</div>';
        // }
        // $("#contents").append(sys + "<br/>");
        // //刷新用户在线列表
        // flushUsers(data.users);
        // //显示正在对谁说话
        // showSayTo();
    });

    function listName(keyItem){
            console.log(keyItem)
            let nameItem = $('#nameItem')
            for(let key in  keyItem){
                let name = keyItem[key]
                console.log(name)

                nameItem.append(`<li class="list-group-item"><div class="nameItemK">${name}</div> <div class="nameItemKright"> 操作按钮 </div></li>`)
            }
    //     let html = `<ul class="list-group">
    //     <li class="list-group-item">Cras justo odio</li>
    //     <li class="list-group-item">Dapibus ac facilisis in</li>
    //     <li class="list-group-item">Morbi leo risus</li>
    //     <li class="list-group-item">Porta ac consectetur ac</li>
    //     <li class="list-group-item">Vestibulum at eros</li>
    //   </ul>`
    }
});