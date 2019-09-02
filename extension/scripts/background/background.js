var socket = io("http://localhost:3000/");
// var socket = io("https://video-sync-api.herokuapp.com/");
var roomName = "";
var URLControlFlag = true;
var PLAYControlFlag = true;
var PAUSEControlFlag = true;
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
		setTimeout(function(){ JOINControlFlag = true; }, 1000);
	});

	socket.on('updateURL', function (data) {
		if(JOINControlFlag){
			if(URLControlFlag){
				URLControlFlag = false;
				PLAYControlFlag = false;
				PAUSEControlFlag = false;
				serverToContent(data);
				console.log(data);
				setTimeout(function(){ PLAYControlFlag = true; PAUSEControlFlag = true; }, 2000);
			}
			else{URLControlFlag = true}
		}
	});

	socket.on('updateControls', function (data) {
		if(data.controls === "play"){
			if(PLAYControlFlag) {
				PLAYControlFlag = false;
				serverToContent(data);
				console.log(data);
			}
			else { PLAYControlFlag = true;}
		}
		else if(data.controls === "pause"){
			if(PAUSEControlFlag) {
				PAUSEControlFlag = false;
				serverToContent(data);
				console.log(data);
			}
			else { PAUSEControlFlag = true;}			
		}
	});

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
    //PAGE LOADED RESET VARS
    else if (request.STATE === "loaded"){
    	setTimeout( function () {
	    	var URLControlFlag = true;
			var PLAYControlFlag = true;
			var PAUSEControlFlag = true;
    	}, 1000);
    }
    //JOINING ROOM
	else if (request.roomName) {
		if(roomName !== "")
			socket.emit('leaving', {socketId: socket.id, roomName: roomName});
		roomName = request.roomName;
		socket.emit('joinRoom', {roomName: roomName, URL: request.URL});
	}
	//URL CHANGE
	else if (request.URL && JOINControlFlag) {
		if(roomName !== ""){
			if(URLControlFlag){
				URLControlFlag = false;
				socket.emit('newURL',{URL: request.URL});
				console.log(request);
			}
			else{ URLControlFlag = true;}
		}
		else{ console.log(request);}
	}
	// CONTROLS
	else if (request.controls) {
		if( roomName !== ""){
			if(request.controls === "play"){
				if(PLAYControlFlag) {
					PLAYControlFlag = false;
					socket.emit('controls', {controls: request.controls});
					console.log(request);
				}
				else { PLAYControlFlag = true;}
			} 
			else if (request.controls === "pause") {
				if(PAUSEControlFlag) {
					PAUSEControlFlag = false;
					socket.emit('controls', {controls: request.controls});
					console.log(request);
				}
				else { PAUSEControlFlag = true;}				
			}
		}
		else{ console.log(request);}
	}
}

//HANDLE INTERACTION
if(isFirefox){browser.runtime.onMessage.addListener(contentToServer);}
else{chrome.extension.onMessage.addListener(contentToServer);}
