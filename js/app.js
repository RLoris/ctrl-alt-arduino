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

// const detectionEvent = 'detectionEvent';
// const detectionLostEvent = 'detectionLostEvent';
const initEvent = 'initEvent';
const moveEvent = 'moveEvent';

//When a client connects, bind each desired event to the client socket
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

	/*
	socket.on('detectionLost', (bodyParts) => {
		// when user is lost
		console.log('DETECTION LOST');
		io.emit(detectionLostEvent, bodyParts);
	});
	*/

	/*
	socket.on('detection', (bodyParts) => {
		// when a user is detected
		console.log('DETECTION');
		io.emit(detectionEvent, bodyParts);
	});
	*/
});


http.listen(3000, () => {
    console.log('listening on 0.0.0.0:3000');
});

