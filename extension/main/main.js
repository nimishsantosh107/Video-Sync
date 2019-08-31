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
	    prevURL = document.URL;
	    videoElement = document.getElementsByTagName("video")[0];
		console.log(document.URL);
		thisbrowser.runtime.sendMessage({"URL": document.URL});
	}
}

function handleInteraction(request, sender) {
	//FROM APP
	if(request.roomName){ 
		console.log(request);
		thisbrowser.runtime.sendMessage({"roomName": request.roomName});
	}
	//FROM BACKGROUND
	if(request.data){
		//URL CHANGE
		if(request.data.URL){
			if(request.data.URL === document.URL)
				return;
			console.log(request.data);
			location.href = request.data.URL;
		}
	}
	else{ console.log(request.error); }
}


//MAIN
var thisbrowser;
var prevURL = "";
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