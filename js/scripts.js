$(document).ready(function(){
		chrome.storage.local.get('Web-Explorer-Toggle', function(result){
				if(result['Web-Explorer-Toggle'] != null){
					chrome.runtime.sendMessage({},function(response){
							if(result['Web-Explorer-Toggle'][""+response['activeTab']] == 1){
								$("head").append('<meta id="Chrome-Extension-URL" content="' + chrome.extension.getURL("") + '">');
								$("head").append("<script src=" + chrome.extension.getURL("js/jquery-2.1.4.min.js") + "></script>");
								$("body").append("<script src=" + chrome.extension.getURL("js/zoom.js") + "></script>");		
								$("body").append("<script src=" + chrome.extension.getURL("js/create.js") + "></script>");
							}
						});
				}
			});
	});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
		$("head").append('<meta id="Chrome-Extension-URL" content="' + chrome.extension.getURL("") + '">');
		$("body").append("<script src=" + chrome.extension.getURL("js/jquery-2.1.4.min.js") + "></script>");
		$("body").append("<script src=" + chrome.extension.getURL("js/zoom.js") + "></script>");		
		$("body").append("<script src=" + chrome.extension.getURL("js/create.js") + "></script>");
		sendResponse({});
		return true;
	});