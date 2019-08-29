//UTIL FUNCTIONS
function getElementByXpath(path) {return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;}

function checkURLChange(){
	if (document.URL !== prevURL) {
	    prevURL = document.URL;
	    var videoElement = document.getElementsByTagName("video")[0];
		console.log(videoElement);
	}
}


//MAIN
var prevURL = "";
//CHECK URL CHANGES
const URLChangeHandler = window.setInterval(checkURLChange, 500);