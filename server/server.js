/*

roomStat - send {room, usercount}
userDisconnecting - send {socketid}
newLeaving - send {leftSocketId}
*/

const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const fs = require('fs');
const path = require('path');

//CONFIG VARIABLES
const PORT = process.env.PORT || 3000;
const IP4 = "192.168.1.100";

var app = express();
var httpServer = http.Server(app);
var io = socketIO(httpServer); 

var rooms = {}

//SOCKET HANDLING
io.on("connection",async (socket)=>{
	console.log("+ CONNECTED: ",socket.id);

	//ROOM
	socket.on('joinRoom',async (data)=>{
		socket.room = data.roomName;
		await socket.join(socket.room);
		if(rooms[socket.room] === undefined){
			var roomObj = {
				clients: 1,
				curURL: "",
			}
			rooms[socket.room] = roomObj;
		}
		else{
			rooms[socket.room].clients++;
			socket.emit('URLOnJoin', {URL: rooms[socket.room].curURL})
		}
		io.to(socket.room).emit('roomStat',{room: socket.room, usercount: io.sockets.adapter.rooms[socket.room].length, URL: rooms[socket.room].curURL});
		console.log(`++  ${socket.id} JOINING |${socket.room}|`);
	});

	//CHANGE IN SONG
	socket.on('newURL', async (data)=>{
		socket.curURL = data.URL;
		rooms[socket.room].curURL = data.URL
		io.to(socket.room).emit('updateURL', data);
		console.log(data.URL);
	});

	//LEAVE & JOIN NEW ROOM
	socket.on('leaving', async (data)=>{
		socket.broadcast.to(socket.room).emit('newLeaving',{leftSocketId: socket.id});
		socket.broadcast.to(socket.room).emit('roomStat',{room: socket.room, usercount: io.sockets.adapter.rooms[socket.room].length-1, URL: rooms[socket.room].curURL});
		rooms[socket.room].clients--;
		if(rooms[socket.room].clients === 0)
			delete rooms[socket.room];
		await socket.leave(socket.room);
		console.log(`--  ${socket.id} LEAVING |${socket.room}|`);
	});

	//HANDLE DISCONNECTION
	socket.on('disconnect',async ()=>{
		if(socket.room && io.sockets.adapter.rooms[socket.room]){
			socket.broadcast.to(socket.room).emit('newLeaving',{leftSocketId: socket.id});
			socket.broadcast.to(socket.room).emit('roomStat',{room: socket.room, usercount: io.sockets.adapter.rooms[socket.room].length, URL: rooms[socket.room].curURL});
			rooms[socket.room].clients--;
			if(rooms[socket.room].clients === 0)
				delete rooms[socket.room];
			socket.leave(socket.room);
		}
		console.log("- DISCONNECTED: ",socket.id);
	});
});

httpServer.listen(PORT, ()=>{console.log(`HTTP SERVER UP ON PORT: ${PORT}`);});