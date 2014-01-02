/**
 * nomal account management
 */
var createCookie = function (name, value) {
	document.cookie = name + "=" + value;
};

var readCookie = function (name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i=0; i< ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
};

var eraseCookie = function (name) {
	createCookie(name, "", -1);
};

var pageLogin = function () {
	window.user.email = readCookie('email');
	window.user.name = readCookie('name');

	if (window.user.email) {
		window.user.isLogin = true;
		changeLoginView(window.user);
	} else {
		changeLoginView(window.user);
	}

	// getRecentlyNoticeData(5);
};

$(document).ready(function() {
	pageLogin();
});