$(document).ready(function(){
		//		$("head").append('<meta name="ChromeURL" content="' + chrome.extension.getURL("")) +'">';
		$("body").append("<script src=" + chrome.extension.getURL("js/jquery-2.1.4.min.js") + "></script>");
		$("body").append("<script src=" + chrome.extension.getURL("js/zoom.js") + "></script>");		
		$("body").append("<script src=" + chrome.extension.getURL("js/create.js") + "></script>");
	});