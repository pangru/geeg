window.fbAsyncInit = function () {
	FB.init({
		appId: '1406967696209973',
		status: true,
		cookie: true,
		xfbml: true
	});

	FB.Event.subscribe('auth.authResponseChange', function(response) {
		if (response.status === 'connected') {
			facebookToken = response.authResponse.accessToken;
			getLoginInfo();

		} else if (response.status === 'not_authorized') {
			loginFB();
		} else {
			FB.login(function (response) { console.log('fb login');}, {scope: 'email'});
		}
	});

	FB.getLoginStatus(function(response) {
		if (response.status === 'connected') {
			FB.api('/me?fields=name,email', function(_user) {
				if (response.session) {
					FB.api('/me?fields=name,email', function(_user) {
	            		if (_user) {
	            			_user.src = 'http://graph.facebook.com/' + _user.id + '/picture';
							_user.isLogin = true;
							
	            			changeLoginView(_user);
	            		}
            		});
            	}
            }, { scope: 'email'});
        } else if (response.status === 'not_authorized') {
        	
		} else {

		}
	});
};

var loginFB = function () {
	console.log('loginFB');

	if (facebookLoginChk == 0) {
		FB.login(function (response) {			
			if (response.authResponse) {
					facebookLoginChk = 1;
					facebookToken = response.authResponse.accessToken;
			}
		}, { scope: 'email'});
	}
};

var getLoginInfo = function () {
	FB.api('/me?fields=name,email', function (response) {
		window.user.fullname = response.name;
		window.user.name = response.name;
		window.user.email = response.email;
		window.user.isLogin = true;

		registerMe(window.user, true);
		changeLoginView(window.user);
	}, { scope: 'email'} );
}

/*

var getFaceBookAppWallList = function () {
	$.ajax({
		url: 'https://graph.facebook.com/264607353690090/posts?locale=ko_KR&access_token=CAACEdEose0cBAJLiO2SZCZBTSCm546p70fdqSsxF0L01uuHgSVo4TjQrBJNZBzo5lYzXybK9jMoASQhSznHWGooScPNLhZCNXsoGU7IG3u5DOqg57iTDjeX97fSNwB9nwHETF48Kdg7W35tPG7pwefmCsslxArVnbW0tAlw87SOfa1pRYPVQAHtZCrgCTzmAZB5HUTyQWlMAZDZD',
		type: 'get',
		success: function (data, status, jqXHR) {
			var _html = '<ul>';
			_html += '<li> Test wall List</li>';

			for (var i = 0; i< data.length; i++) {
				var node = data[i];
				_html += '<a href="' + node.actions[0].link + '" target="_blank">' + node.message + '</a>';
			}

			_html += "</ul>";
			$("#fb_wall").html(_html);
		}, 

		error: function (jqXHR, status, errorThrown) {
		}
	});
};
*/