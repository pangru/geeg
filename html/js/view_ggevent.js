var showNoticeHtml = function () {
	showNavigation(view.ggevent.navigation, 'sub_menu_02_m5s1');
	runAjax(view.ggevent.notice.list_html, 'get', null, 
		function (data) {
			removeMainBanner();
			$("#sideRight").html(data);

			getNoticeDataList();
		}
	);
};

var getNoticeDataList = function () {
	runAjax(view.ggevent.notice.list_data, 'get', null,
		function (data) {
			var _html = "";
			for (var i=0; i< data.length; i++) {
				_html = _html + "<tr><td>" + (i+ 1) + "</td><td class='subject'>";
				_html = _html + "<a href='#' onClick='getNoticeReadHtml(" + data[i].nid + ")'>" + data[i].title + "</a></td>";
				_html = _html + "<td>" + data[i].name + "</td><td>" + data[i].create_date + "</td>"
				_html = _html + "<td>" + data[i].read_cnt + "</td></tr>";
			}

			$("#notice_content").html(_html);
		}
	);
}

var getRecentlyNoticeData = function (count) {
	var params = { count: count};
	runAjax(view.ggevent.notice.list_data, 'get', params,
		function (data) {
			var _html = "";
			for (var i=0; i< data.length; i++) {
				_html = _html + "<tr height='20'><td class='subject'>";
				_html = _html + "<a href='#' onClick='getNoticeReadHtml(" + data[i].nid + ")'>" + data[i].title + "</a></td>";
				_html = _html + "<td class='date'>" + data[i].create_date + "</td></tr>";
			}

			if (data.length == 0) {
				_html = "게시글이 없습니다 ";
			}

			$("#tab_board").html(_html);
		}
	);
}

var getNoticeReadHtml = function (nid) {
	showNoticeWriteHtml();
	var params = { nid: nid};
	// runAjax(view.ggevent.notice.write_html, 'get', null,
	// 	function (data) {
	// 		$(".bd_body").html(data);
	// 		getNoticeReadData(nid);
	// 	}
	// );
};

var getNoticeReadData = function (nid) {
	var params = { nid: nid};
	runAjax(view.ggevent.notice.list_data, 'get', params,
		function (data) {
			var _html = "";
			for (var i=0; i< data.length; i++) {
				_html = _html + "<tr height='20'><td class='subject'>";
				_html = _html + "<a href='#' onClick='getNoticeReadHtml(" + data[i].nid + ")'>" + data[i].title + "</a></td>";
				_html = _html + "<td class='date'>" + data[i].create_date + "</td></tr>";
			}

			if (data.length == 0) {
				_html = "게시글이 없습니다 ";
			}

			$("#tab_board").html(_html);
		}
	);
};

var showNoticeWriteHtml = function () {
	runAjax(view.ggevent.notice.write_html, 'get', null, 
		function (data) {
			$(".bd_body").html(data);
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
