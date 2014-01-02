window.fbAsyncInit = function () {
	FB.init({
		appId: '1460133270875122',
		status: true,
		cookie: true,
		xfbml: true
	});

	FB.Event.subscribe('auth.authResponseChange', function(response) {
		if (response.status === 'connected') {
			//To do Edit.. 
			testAPI();
		} else if (response.status === 'not_authorized') {
			FB.login();
		} else {
			FB.login();
		}
	});
};

(function (d) {
	var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script') [0];
	if (d.getElementById(d)) { return ;}
	js = d.createElement('script');
	js.id = id;
	js.async = true;
	js.src = "https://connect.facebook.net/en_US/all.js";
	ref.parentNode.insertBefore(js, ref);
}(document));

function testAPI() {
	FB.api('/me', function(response) {
	});
}