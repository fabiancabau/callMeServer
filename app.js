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
		socket.join(data.type);

		if (data.type == 'patient') {
			patients.push(data);
			io.to('nurse').emit('new patient', data);
		}
		else if (data.type == 'nurse') {
			socket.emit('patients', {patients: patients});
		}
	});

	socket.on('call nurses', function (data) {
		io.to('nurse').emit('need help', {name: data.name});
	})


});