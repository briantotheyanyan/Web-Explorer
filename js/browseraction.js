chrome.storage.local.get('Web-Explorer-Toggle',function(result){
		if(result['Web-Explorer-Toggle'] == null){
			var newObject = {};
			chrome.storage.local.set({'Web-Explorer-Toggle':newObject},function(){});
		}
	});

chrome.browserAction.onClicked.addListener(function(tab){
		chrome.storage.local.get('Web-Explorer-Toggle',function(result){
				if(result['Web-Explorer-Toggle'] == null){
					var newObject = {};
					newObject[""+tab.id] = 1;
					chrome.storage.local.set({'Web-Explorer-Toggle':newObject}, function(){});
					chrome.tabs.sendMessage(tab.id, {'active': tab.id}, function(response){});
				}
				else if(result['Web-Explorer-Toggle'][""+tab.id] == 0 || result['Web-Explorer-Toggle'][""+tab.id] == null){
					var newObject = result['Web-Explorer-Toggle'];
					newObject[""+tab.id] = 1;
					chrome.storage.local.set({'Web-Explorer-Toggle':newObject}, function(){});
					chrome.tabs.sendMessage(tab.id, {'active': tab.id}, function(response){});
				}
				else{
					var newObject = result['Web-Explorer-Toggle'];
					newObject[""+tab.id] = 0;
					chrome.storage.local.set({'Web-Explorer-Toggle':newObject},function(){});
				}
			});
	});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
				sendResponse({'activeTab': tabs[0].id});
			});
		return true;
	});