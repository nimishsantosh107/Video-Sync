var socket = io("http://localhost:3000/");
var roomName = "";
var URLControlFlag = true;
var JOINControlFlag = false;
var isFirefox;

try {isFirefox = typeof InstallTrigger !== 'undefined';} 
catch(e) {isFirefox = false;}

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
		console.log(data);
		serverToContent(data);
	});

	socket.on('URLOnJoin', function (data) {
		console.log(data);
		serverToContent(data);
		setTimeout(function(){ JOINControlFlag = true; }, 6000);
	});

	socket.on('updateURL', function (data) {
		if(JOINControlFlag){
			if(URLControlFlag){
				URLControlFlag = false;
				console.log(data);
				serverToContent(data);
			}
			else{URLControlFlag = true}
		}
	});

	socket.on('newLeaving', function (data) {
		console.log(data);
		serverToContent(data);
	});
});

function handleInteraction (request, sender) {
    //ONLY CHROME
    if (request.command === "activate_icon") {
        chrome.pageAction.show(sender.tab.id);
    }
	if (request.roomName) {
		if(roomName !== "")
			socket.emit('leaving', {socketId: socket.id, roomName: roomName});
		roomName = request.roomName;
		socket.emit('joinRoom', {roomName: roomName});
	}
	if (request.URL && JOINControlFlag) {
		if(URLControlFlag){
			URLControlFlag = false;
			console.log(request);
			socket.emit('newURL',{URL: request.URL});
		}
		else{ URLControlFlag = true;}
	}
}

//HANDLE INTERACTION
if(isFirefox){browser.runtime.onMessage.addListener(handleInteraction);}
else{chrome.extension.onMessage.addListener(handleInteraction);}
