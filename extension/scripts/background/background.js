var socket = io("http://localhost:3000/");
var roomName = "";
var URLControlFlag = true;
var PLAYPAUSEControlFlag = true;
var JOINControlFlag = false;
var isFirefox;

//CHECK IF FIREFOX
try {isFirefox = typeof InstallTrigger !== 'undefined';} 
catch(e) {isFirefox = false;}

//HADNDLE INERACTION
function serverToContent (data) {
	if(isFirefox){
		browser.tabs.query({currentWindow: true, active: true}, function (tabs) {
			browser.tabs.sendMessage(tabs[0].id, {data: data});
		});
	}else{
		chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {data: data});
		});
	}
}

socket.on('connect', async function () {
	console.log('CONNECTED');

	socket.on('roomStat', function (data) {
		serverToContent(data);
		console.log(data);
	});

	socket.on('URLOnJoin', function (data) {
		serverToContent(data);
		console.log(data);
		setTimeout(function(){ JOINControlFlag = true; }, 6000);
	});

	socket.on('updateURL', function (data) {
		if(JOINControlFlag){
			if(URLControlFlag){
				URLControlFlag = false;
				serverToContent(data);
				console.log(data);
			}
			else{URLControlFlag = true}
		}
	});

	socket.on('updateControls', function (data) {
		if(PLAYPAUSEControlFlag) {
			PLAYPAUSEControlFlag = false;
			serverToContent(data);
			console.log(data);
		}
		else { PLAYPAUSEControlFlag = true;}

	})

	socket.on('newLeaving', function (data) {
		serverToContent(data);
		console.log(data);
	});
});

//HANDLE INTERACTION
function contentToServer (request, sender) {
    //ONLY CHROME
    if (request.command === "activate_icon") {
        chrome.pageAction.show(sender.tab.id);
    }
    //JOINING ROOM
	if (request.roomName) {
		if(roomName !== "")
			socket.emit('leaving', {socketId: socket.id, roomName: roomName});
		roomName = request.roomName;
		socket.emit('joinRoom', {roomName: roomName});
	}
	//URL CHANGE
	if (request.URL && JOINControlFlag) {
		if(URLControlFlag){
			URLControlFlag = false;
			socket.emit('newURL',{URL: request.URL});
			console.log(request);
		}
		else{ URLControlFlag = true;}
	}
	// CONTROLS
	if(request.controls) {
		if(PLAYPAUSEControlFlag) {
			PLAYPAUSEControlFlag = false;
			socket.emit('controls', request);
			console.log(request);
		}
		else { PLAYPAUSEControlFlag = true;}
	}
}

//HANDLE INTERACTION
if(isFirefox){browser.runtime.onMessage.addListener(contentToServer);}
else{chrome.extension.onMessage.addListener(contentToServer);}
