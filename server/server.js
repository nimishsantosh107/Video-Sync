/*
roomStat - send {room, usercount}
userDisconnecting - send {socketid}

*/

const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

//CONFIG VARIABLES
const PORT = process.env.PORT || 3000;
const IP4 = "192.168.1.100";

var app = express();
var httpServer = http.Server(app);
var io = socketIO(httpServer); 

//SOCKET HANDLING
io.on("connection",async (socket)=>{
	console.log("+ CONNECTED: ",socket.id);

	//ROOM
	socket.on("joinRoom",async (data)=>{
		socket.room = data.roomName;
		await socket.join(socket.room);
		io.to(socket.room).emit('roomStat',{room: socket.room, usercount: io.sockets.adapter.rooms[socket.room].length});
		console.log(`++  ${socket.id} JOINING |${socket.room}|`);
	});

	//LEAVE & JOIN NEW ROOM
	socket.on('leaving', async (data)=>{
		socket.broadcast.to(socket.room).emit('newLeaving',{leftSocketId: socket.id});
		socket.broadcast.to(socket.room).emit('roomStat',{room: socket.room, usercount: io.sockets.adapter.rooms[socket.room].length-1});
		await socket.leave(socket.room);
		console.log(`--  ${socket.id} LEAVING |${socket.room}|`);
	});

	//HANDLE DISCONNECTION
	socket.on("disconnect",async ()=>{
		if(socket.room && io.sockets.adapter.rooms[socket.room]){
			socket.broadcast.to(socket.room).emit('newLeaving',{leftSocketId: socket.id});
			socket.broadcast.to(socket.room).emit('roomStat',{room: socket.room, usercount: io.sockets.adapter.rooms[socket.room].length});
			socket.leave(socket.room);
		}
		console.log("- DISCONNECTED: ",socket.id);
	});
});

httpServer.listen(PORT, ()=>{console.log(`HTTP SERVER UP ON PORT: ${PORT}`);});