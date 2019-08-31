document.addEventListener('DOMContentLoaded', function () {
	if(chrome){
		joinRoomButton.addEventListener('click', function () {
			chrome.tabs.query({currentWindow: true, active: true},
				function (tabs) {
					if(roomText.value === ""){
						chrome.tabs.sendMessage(tabs[0].id, {error: "Room name empty"});
						return;	
					}else{ chrome.tabs.sendMessage(tabs[0].id, {roomName: roomText.value});	}
				}
			);
		}, false);
	}else{
		joinRoomButton.addEventListener('click', function () {
			if(roomText.value === "")
				return;
			browser.tabs.getCurrent().then(function (tabs) {
				if(roomText.value === ""){
					chrome.tabs.sendMessage(tabs[0].id, {error: "Room name empty"});
					return;	
				}else{ chrome.tabs.sendMessage(tabs[0].id, {roomName: roomText.value});	}
			}, function (err) {
				browser.tabs.sendMessage(tabs[0].id, {error: err});
			});
		}, false);
	}
}, false);