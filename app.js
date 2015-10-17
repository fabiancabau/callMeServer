var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');


var nurses = [];
var patients = [];

console.log('Listening on port 3000');
server.listen(3000);


app.use(express.static(path.join(__dirname, 'client')));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});


io.sockets.on('connection', function (socket) {

	socket.on('add user', function (data){
		console.log(data.token);

		if (data.type == 'patient') {
			patients.push({info: data, socket_id: socket.id, token: data.token});
			io.to('nurse').emit('new patient', {info: data, socket_id: socket.id});
		}
		else if (data.type == 'nurse') {
			socket.emit('patients', patients);
			console.log('Nurse connected, sending patients;');
			console.log(patients);
		}
	});

	socket.on('call nurses', function (data) {
		io.to('nurse').emit('need help', {name: data.name});
	});

	socket.on('disconnect', function() {
		for (var x = 0; x < patients.length; x++) {
			if (patients[x].socket_id == socket.id) {
				patients.splice(x, 1);
			}
		}

		io.to('nurse').emit('patients', patients);
	});


});