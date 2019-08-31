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

//SETUP
//IN CHROME
if(chrome){ 
	//ACTIVATE POPUP
	chrome.runtime.sendMessage({"message": "activate_icon"});

	//HANDLE INCOMING ROOM NAME
	chrome.runtime.onMessage.addListener(function (request, sender) {
		console.log(request);
		URLChangeHandler = window.setInterval(checkURLChange, 1000);
		roomName = request.roomName;
	});
}
// OTHER BROWSERS
else{
	//HANDLE INCOMING ROOM NAME
	browser.runtime.onMessage.addListener(function (request, sender) {
		if(request.roomName){ 
			console.log(request);
			URLChangeHandler = window.setInterval(checkURLChange, 1000);
			roomName = request.roomName;}
		else{ console.log(err) }
	});
}


//MAIN
var prevURL = "";
var roomName = "";
var URLChangeHandler = null;