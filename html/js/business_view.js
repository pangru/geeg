var showNavigation = function (url, selectedCss) {
	runAjax(url, 'get', null, 
		function (data) {
			$(".nav_wrap_sub_menu").html(data);
			$("#" + selectedCss).addClass("active");
		}
	);
}

/** 
 *  Business Menu
 */
var showGoalHtml = function () {
	showNavigation(view.business.navigation, 'sub_menu_02_m1s1');
	runAjax(view.business.goal_html, 'get', null, 
		function (data) {
			removeMainBanner();
			$("#sideRight").html(data);
		});
};

var showCoreHtml = function () {
	showNavigation(view.business.navigation, 'sub_menu_03_m1s2');
	runAjax(view.business.core_html, 'get', null, 
		function (data) {
			removeMainBanner();
			$("#sideRight").html(data);
		});
};

var showOrgHtml = function () {
	showNavigation(view.business.navigation, 'sub_menu_04_m1s3');
	runAjax(view.business.org_html, 'get', null, 
		function (data) {
			removeMainBanner();
			$("#sideRight").html(data);
		}
	);
}

/**
 *  salted food story
		feature_html: '',
		effect_html: '',
		choice_html: ''

 */
var showCharHtml = function () {
	showNavigation(view.ggstory.navigation, 'sub_menu_02_m2s1');
	runAjax(view.ggstory.char_html, 'get', null,
		function (data) {
			removeMainBanner();
			$("#sideRight").html(data);
		}
	);
}

var showEffectHtml = function () {
	showNavigation(view.ggstory.navigation, 'sub_menu_03_m2s2');
	runAjax(view.ggstory.effect_html, 'get', null,
		function (data) {
			removeMainBanner();
			$("#sideRight").html(data);
		}
	);
}

var showTypeHtml = function () {
	showNavigation(view.ggstory.navigation, 'sub_menu_04_m2s3');
	runAjax(view.ggstory.type_html, 'get', null,
		function (data) {
			removeMainBanner();
			$("#sideRight").html(data);
		}
	);
}

/**
 *  salted food Market
 */
var showMarketContactHtml = function () {
	showNavigation(view.market.navigation, '');
	runAjax(view.market.maket_html, 'get', null,
		function (data) {
			removeMainBanner();
			$("#sideRight").html(data);
		}
	);
};

/**
 *  GG Map
 */
var showMarketMaptHtml = function () {
	showNavigation(view.ggmap.navigation, 'sub_menu_02_m4s1');
	$("#sideRight").html('');

	window.open(view.homeUrl + view.ggmap.market_html, '_new');
};

var showRecommMaptHtml = function () {
	showNavigation(view.ggmap.navigation, 'sub_menu_03_m4s2');
	$("#sideRight").html('');

	window.open(view.ggmap.recomm_html, '_new');
};

var showHotelMaptHtml = function () {
	showNavigation(view.ggmap.navigation, 'sub_menu_04_m4s3');
	runAjax(view.ggmap.hotel_html, 'get', null, 
		function (data) {
			removeMainBanner();
			$("#sideRight").html(data);
		}
	);
};

var showRestMaptHtml = function () {
	showNavigation(view.ggmap.navigation, 'sub_menu_05_m4s4');
	runAjax(view.ggmap.rest_html, 'get', null, 
		function (data) {
			removeMainBanner();
			$("#sideRight").html(data);
		}
	);
};

/**
 *  business introduce
 */
var showNoticeHtml = function () {
	showNavigation(view.ggevent.navigation, 'sub_menu_02_m5s1');
	runAjax(view.ggevent.notice.list_html, 'get', null, 
		function (data) {
			removeMainBanner();
			$("#sideRight").html(data);

			getNoticeData();
		}
	);
};

var getNoticeData = function () {
	runAjax(view.ggevent.notice.list_data, 'get', null,
		function (data) {
			var _html = "";
			for (var i=0; i< data.length; i++) {
				_html = _html + "<tr><td>" + (i+ 1) + "</td><td class='subject'>";
				_html = _html + "<a href='#'>" + data[i].title + "</a></td>";
				_html = _html + "<td>" + data[i].name + "</td><td>" + data[i].create_date + "</td>"
				_html = _html + "<td>" + data[i].read_cnt + "</td></tr>";
			}

			$("#notice_content").html(_html);
		}
	);
}

var getRecentlyNoticeData = function (count) {
	var params = 'count=' + count;
	runAjax(view.ggevent.notice.list_data, 'get', params,
		function (data) {
			var _html = "";
			for (var i=0; i< data.length; i++) {
				_html = _html + "<tr><td>" + (i+ 1) + "</td><td class='subject'>";
				_html = _html + "<a href='#'>" + data[i].title + "</a></td>";
				_html = _html + "<td>" + data[i].name + "</td><td>" + data[i].create_date + "</td>"
				_html = _html + "<td>" + data[i].read_cnt + "</td></tr>";
			}

			$("#notice_content").html(_html);
		}
	);
}

var showNtoiceWriteHtml = function () {
	runAjax(view.ggevent.notice.write_html, 'get', null, 
		function (data) {
			$("#sideRight").html(data);
		} 
	);
}

var writeNotice = function (_form) {
	var info = {
		title: _form.title.value,
		cnts: _form.cnts.value,
		email: window.user.email,
		uid: window.user.uid
	};

	runAjax(view.ggevent.notice.post.write, 'post', info, 
		function (data) {
			showNoticeWriteHtml();
		}
	);
}

/**
 * Business Introduce Floor
 */
var showCalenderHtml = function () {
	showNavigation(view.ggevent.navigation, 'sub_menu_03_m5s2');
	runAjax(view.ggevent.calender.list_html, 'get', null, 
		function (data) {
			removeMainBanner();
			$("#sideRight").html(data);
		} 
	);	
};

var showPhotoHtml = function () {
	showNavigation(view.ggevent.navigation, 'sub_menu_04_m5s3');
	runAjax(view.ggevent.photo.list_html, 'get', null, 
		function (data) {
			removeMainBanner();
			$("#sideRight").html(data);
		} 
	);
	
};

var showVideoHtml = function () {
	showNavigation(view.ggevent.navigation, 'sub_menu_05_m5s4');
	runAjax(view.ggevent.video.list_html, 'get', null, 
		function (data) {
			removeMainBanner();
			$("#sideRight").html(data);
		} 
	);	
};

/**
 * Play
 */
 // Notice List
 <!--// show HTML Page View -->
var showPlayNavagation = function () {
	runAjax(view.play.navigation, 'get', null, 
		function (data) {
			$(".nav_wrap_sub_menu").html(data);
		}
	);
}

var showBoardHtml = function () {
	showNavigation(view.play.navigation, 'sub_menu_02_m6s1');
	runAjax(view.play.board.list_html, 'get', null, 
		function (data) {
			removeMainBanner();
			$("#sideRight").html(data);

		}
	);
};

var showSNSHtml = function () {
	showNavigation(view.play.navigation, 'sub_menu_03_m6s2');
	runAjax(view.play.sns.list_html, 'get', null, 
		function (data) {
			removeMainBanner();
			$("#sideRight").html(data);

		}
	);
};

var showFoodHtml = function () {
	showNavigation(view.play.navigation, 'sub_menu_04_m6s3');
	runAjax(view.play.food.list_html, 'get', null, 
		function (data) {
			removeMainBanner();
			$("#sideRight").html(data);

		}
	);
};