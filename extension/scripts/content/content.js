/*
	RECV
		roomName
		error
	SEND
		message
		roomName
		URL
*/

//UTIL FUNCTIONS
function getElementByXpath(path) {return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;}


function checkURLChange(){
	if (document.URL !== prevURL) {
		thisbrowser.runtime.sendMessage({"URL": document.URL});
	    prevURL = document.URL;
	    videoElement = document.getElementsByTagName("video")[0];
	    setListeners();
		console.log(document.URL);
	}
}

function setListeners() {
	var timeoutID = setInterval(function () {
		console.log(videoElement.readyState)
		if(videoElement.readyState === 4){
			console.log('VID LOADED');
			setTimeout(function(){ videoElement.pause(); }, 500);
			clearTimeout(timeoutID);
		}
	}, 100);

	videoElement.onplay = function () {
		thisbrowser.runtime.sendMessage({controls: "play"});
		console.log('PLAYING')
	}

	videoElement.onpause = function() {
		thisbrowser.runtime.sendMessage({controls: "pause"});
		console.log('PAUSED');
	}
}

function handleInteraction(request, sender, sendMessage) {
	//FROM POPUP
	if(request.roomName){ 
		thisbrowser.runtime.sendMessage({"roomName": request.roomName});
		console.log(request);
	}
	//FROM BACKGROUND
	else if(request.data){
		//ROOMSTAT
		if(request.data.usercount){
			roomInfo = request.data;
			console.log(request.data);
		}
		//URL CHANGE
		else if(request.data.URL){
			if(request.data.URL === document.URL)
				return;
			location.href = request.data.URL;
			console.log(request.data);
		}
		//PLAY/PAUSE
		else if(request.data.controls){
			console.log(request.data)
			if(request.data.controls === "play" ){
				videoElement.play();
			}
			else if(request.data.controls === "pause" ){
				videoElement.pause();
			}
		}
	}
	else{ console.log(request.error); }
}

//MAIN
var thisbrowser;
var prevURL = "";
var roomInfo = null;
var videoElement = null;
//ACTIVATE URL CHANGR CHECKER
var URLChangeHandler = window.setInterval(checkURLChange, 1000);
//SET GLOBAL BROWSER
if(chrome){
	thisbrowser = chrome;
	chrome.runtime.sendMessage({"command": "activate_icon"});
}else {thisbrowser = browser;}
//HANDLE INTERACTION B/W APP and BACKGROUND
thisbrowser.runtime.onMessage.addListener(handleInteraction);