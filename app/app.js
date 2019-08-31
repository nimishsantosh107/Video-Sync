document.addEventListener('DOMContentLoaded', function () {
	if(chrome){
		joinRoomButton.addEventListener('click', function () {
			if(roomText.value === "")
				return;
			chrome.tabs.query({currentWindow: true, active: true},
				function (tabs) {
					chrome.tabs.sendMessage(tabs[0].id, {room: roomText.value});
				}
			);
		}, false);
	}else{
		joinRoomButton.addEventListener('click', function () {
			if(roomText.value === "")
				return;
			browser.tabs.getCurrent().then(function (tabs) {
				browser.tabs.sendMessage(tabs[0].id, {room: roomText.value});
			}, function (err) {
				browser.tabs.sendMessage(tabs[0].id, {error: err});
			})
		}, false);
	}
}, false);