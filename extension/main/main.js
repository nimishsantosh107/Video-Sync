//UTIL FUNCTIONS
function getElementByXpath(path) {return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;}

function checkURLChange(){
	if (document.URL !== prevURL) {
	    prevURL = document.URL;
	    var videoElement = document.getElementsByTagName("video")[0];
		console.log(videoElement);
		console.log(document.URL);
	}
}

function handleInteraction(request, sender) {
	if(request.roomName){ 
		console.log(request);
		if(roomName !== ""){
			socket.emit('leaving', {socketId: socket.id, room: roomName});
		}
		roomName = request.roomName;
		socket.emit('joinRoom', {roomName: roomName});
	}
	else{ console.log(request.error); }
}

//MAIN
var socket = io("http://localhost:3000/");
var prevURL = "";
var roomName = "";
var URLChangeHandler = null;

socket.on('connect', async function () {
	console.log('CONNECTED');
	console.log(socket);

	//ACTIVATE URL CHANGR CHECKER
	URLChangeHandler = window.setInterval(checkURLChange, 1000);

	//SETUP
	//IN CHROME
	if(chrome){ 
		//ACTIVATE POPUP
		chrome.runtime.sendMessage({"message": "activate_icon"});

		//HANDLE INCOMING ROOM NAME
		chrome.runtime.onMessage.addListener(handleInteraction);
	}
	// OTHER BROWSERS
	else{
		//HANDLE INCOMING ROOM NAME
		browser.runtime.onMessage.addListener(handleInteraction);
	}

	socket.on('roomStat', function (data) {
		console.log(data);
	});

	socket.on('newLeaving', function (data) {console.log(`${data.leftSocketId} LEFT THE ROOM`);});
});