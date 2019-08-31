//ACTIVATE PAGE ICON ON CHROME
if(chrome){
	chrome.extension.onMessage.addListener(
	    function(request, sender, sendResponse) {
	    if (request.message === "activate_icon") {
	        chrome.pageAction.show(sender.tab.id);
	    }
	});
}