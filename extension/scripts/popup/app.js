function handleInteraction (thisbrowser) {
	joinRoomButton.addEventListener('click', function () {
		if(roomText.value === "")
			return;
		thisbrowser.tabs.query({currentWindow: true, active: true},
			function (tabs) {
				if(roomText.value === ""){
					thisbrowser.tabs.sendMessage(tabs[0].id, {error: "Room name empty"});
					return;	
				}else{ thisbrowser.tabs.sendMessage(tabs[0].id, {roomName: roomText.value});	}
			}
		);
	}, false);
}

document.addEventListener('DOMContentLoaded', function () {
	if(chrome){ handleInteraction(chrome);}
	else{ handleInteraction(browser); }	
}, false);
