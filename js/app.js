const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const util = require('util');
const clients = [];

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    return res.sendFile('index.html', {
        root: './public'
    });
})

const initEvent = 'initEvent';
const moveEvent = 'moveEvent';
const winEvent = 'winEvent';

//When a client connects

io.on('connection', socket =>{

	//track connected clients via log

	clients.push(socket.id);
	const clientConnectedMsg = 'User connected ' + util.inspect(socket.id) + ', total: ' + clients.length;
	io.emit(chatEvent, clientConnectedMsg);
	console.log(clientConnectedMsg);

	//track disconnected clients via log

	socket.on('disconnect', () =>{
		clients.pop(socket.id);
		const clientDisconnectedMsg = 'User disconnected ' + util.inspect(socket.id) + ', total: ' + clients.length;
		io.emit(chatEvent, clientDisconnectedMsg);
		console.log(clientDisconnectedMsg);
	});

	socket.on('init', (initPose) => {
		console.log('Game Init');
		io.emit(initEvent, initPose);
	});

	socket.on('move', (movePose) => {
		console.log('Person moved !');
		io.emit(moveEvent, movePose);
	})

	socket.on('OnWin', () => {
		console.log('Win !');
		io.emit(winEvent, {});
	})

});


http.listen(3000, () => {
    console.log('listening on 0.0.0.0:3000');
});

