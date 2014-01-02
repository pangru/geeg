var bookmark = function () {
	var title = 'culture market';
	var url = view.home;

    if(document.all) { // ie
        window.external.AddFavorite(url, title);
    }
    else if(window.sidebar) { // firefox
        window.sidebar.addPanel(title, url, "");
    }
    else if(window.opera && window.print) { // opera
        var elem = document.createElement('a');
        elem.setAttribute('href',url);
        elem.setAttribute('title',title);
        elem.setAttribute('rel','sidebar');
        elem.click(); // this.title=document.title;
    }
}

var removeMainBanner = function () {
	$(".visual").remove();
	$("#main").remove();

	$(".header_con").addClass("header_con_sub");
	$(".header_con").removeClass("header_con_main");

	$(".sub_visual").show();
	$("#container").show();
};

var logoutButtonClicked = function () {
	runAjax(view.user.get.logout, 'get', window.user, 
		function (data) {
			$(".logout_block").show();
			$(".login_block").hide();

			FB.logout();

			eraseCookie("name");
			eraseCookie("email");

			changeLogoutView();
		}
	);
};

var loginButtonClicked = function () {
	runAjax(view.user.login_html, 'get', null, 
		function (data) {
			$("#login").show();
			$("#login").html(data);
		}
	);
};

var loginMe = function (_form) {
	var info = {
		email: _form.email.value,
		password: _form.password.value
	};

	runAjax(view.user.post.login, 'post', info, 
		function (data) {
			if (data) {
				info.name = data.name;
				info.isLogin = true;

				changeLoginView(info);
			}
		}
	);
}

var loginboxCloseButtonClicked = function () {
	$("#login").hide();
	$("#login").html('');
}

var registerButtonClicked = function () {
	runAjax(view.user.register_html, 'get', null, 
		function (data) {
			$("#register").show();
			$("#register").html(data);
		}
	);
};

var registerCloseButtonClicked = function () {
	$("#register").hide();
	$("#register").html('');
}

var registerMe = function (_form, _isSNS) {
	var params = {};

	if (!_isSNS) {
		params = {
			name: _form.fullname.value,
			email: _form.email.value,
			password: _form.passwd.value,
			isSNS: _isSNS
		};
	} else {
		params = _form;
	}

	runAjax(view.user.post.register, 'post', params, 
		function (data) {
			registerCloseButtonClicked();
		}
	);
};

var changeLoginView = function (_user) {
	if (_user.isLogin) {
		window.user = _user;
		createCookie("email", _user.email);
		createCookie("name", _user.name);

		loginboxCloseButtonClicked();

		$("#header_user_name").html(_user.name);
		$(".logout_block").show();
		$(".login_block").hide();		
	} else {
		$(".logout_block").hide();
		$(".login_block").show();
	}
}

var changeLogoutView = function () {
	$(".logout_block").hide();
	$(".login_block").show();
}

var runAjax = function (url, type, data, successCallback) {
	$.ajax({
		url: url,
		type: type,
		data: data,
		success: function (data, status, jqXHR) {
			successCallback(data)
		}
	});
}