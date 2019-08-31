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
		browser.runtime.sendMessage({"URL": document.URL});
	}
}

function handleInteraction(request, sender) {
	//FROM APP
	if(request.roomName){ 
		console.log(request);
		browser.runtime.sendMessage({"roomName": request.roomName});
	}
	//FROM BACKGROUND
	if(request.data){
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
if(chrome){
	var browser = chrome;
	//ACTIVATE POPUP
	chrome.runtime.sendMessage({"command": "activate_icon"});
}
browser.runtime.onMessage.addListener(handleInteraction);
var prevURL = "";
var videoElement = null;
//ACTIVATE URL CHANGR CHECKER
var URLChangeHandler = window.setInterval(checkURLChange, 1000);