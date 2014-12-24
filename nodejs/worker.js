var io = require('socket.io')(5080);
var redis = require('socket.io-redis');
var cookie = require('./tool/cookie.js');
var superagent = require('superagent');
io.adapter(redis({
	host : '127.0.0.1',
	prot : 6379
}));
/**
 * 监听与响应客户端事件
 */
io.on('connection', function(socket) {

	d('Client connection ...');

	try {
		var cookies = socket.request.headers.cookie;

		var sessId = cookie.parseCookie(cookies).phpsessid;
	} catch (err) {
		console.log(err.message);
		return false;
	}

	getSession(sessId, function(session) {
		if (!session.userId || !session.userName) {
			socket.emit('connection', {
				status : 0,
				data : {
					code : 'USER_NOT_LOGIN',
					desc : '用户未登录'
				}
			});
			return false;
		} else {
			socket.emit('connection', {
				status : 1,
				data : 'connection ok!'
			});
		}
		listenEvent(socket, session);
	})
})

var listenEvent = function(socket, session) {
	var userId = session.userId;
	var userName = session.userName;
	var userRoom = session.userRoom;
	//连接成功如果用户在房间内踢出用户
	socket.broadcast.emit('enforceOutRoom_' + userRoom, {
		userId:userId,
		name : userName,
		outTime : getDate()
	});
	
	
	// 接收新消息
	socket.on('newMessage', function(data) {
		d(data);
		// 取得接收到的消息内容
		var cmd = data.cmd;
		var roomId = data.roomId;
		var senderId = data.senderId;
		var senderName = data.senderName;
		var receiveId = data.receiveId;
		var receiveName = data.receiveName;
		var msgContent = data.msgContent;
		// 组合消息数据
		var result = {};
		result.senderId = senderId;
		result.receiveId = receiveId;
		result.receiveName = receiveName;
		result.senderName = senderName;
		result.roomId = roomId;
		result.msgContent = msgContent;
		result.sendTime = getDate();
		// 房间消息
		if (cmd == 'roomMsg' && roomId > 0) {
			d('roomMsgTo_' + roomId);
			socket.emit('roomMsgTo_' + roomId, result);
			socket.broadcast.emit('roomMsgTo_' + roomId, result);
		}
		// 私聊
		if (cmd == 'privateMsg' && receiveId > 0) {
			d('privateMsgTo_' + senderId);
			socket.emit('privateMsgTo_' + senderId, result);
			socket.broadcast.emit('privateMsgTo_' + receiveId, result);
		}
	})
	// 进入房间
	socket.on('joinRoom', function(data) {
		var roomId = data.roomId;
		data.joinTime = getDate();
		socket.broadcast.emit('joinRoom_' + roomId, data);
	})
	// 断开连接
	socket.on('disconnect', function() {
		d('outRoom_' + userRoom);
		socket.broadcast.emit('outRoom_' + userRoom, {
			userId:userId,
			name : userName,
			outTime : getDate()
		});
	})
}
/**
 * 取得会话信息
 */
var getSession = function(sessId, callBack) {
	superagent.get(
			'http://chatapp.izhengyin.com/session.php?sessId='
					+ sessId).end(function(err, sres) {
		// 常规的错误处理
		if (err) {
			return errorHandler(err);
		} else {
			try {
				var session = JSON.parse(sres.text);
			} catch (err) {
				return errorHandler(err);
			}
			callBack(session);
		}
	})
}

var errorHandler = function(err) {
	console.log(err);
}

var d = function(msg) {
	console.log(msg);
}

var getDate = function() {
	var oDate = new Date();
	var y = oDate.getFullYear();
	var m = oDate.getMonth() + 1;
	var d = oDate.getDate();
	var h = oDate.getHours();
	var i = oDate.getMinutes();
	var s = oDate.getSeconds();
	return y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s;
}
