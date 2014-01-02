;(function($){
	// XML to LI list Start
	$.fn.xmlToElement_002 = function(options)
	{
		var _this = $(this),
			_dataList, // 아웃풋 데이터리스트
			_opts = $.extend( {}, $.fn.xmlToElement_002.defaults, options ),
			_str = '',
			_itmNum = 0,
			
			// 생성자 함수 (데이터 로드)
			_init = function()
			{
				_this.append(_makeElement()); // 기초 엘리먼트 제작

				$.ajax({
					type: 'get',
					url: _opts.url,
					error: function(obj, status, err) {
						_this.html(_opts.errorMsg + ' (' + status + ')').show().width('auto').height('auto');
					},
					dataType: 'xml',
					success: function(data) {
						var xmlData = $(data).find('xml_data');
						
						_this.find('.sliderkit-nav-clip').append(
							$('<ul/>').append(_block(xmlData, 'thum'))
						);
						_this.find('.sliderkit-panels').append(_block(xmlData, 'img'));

						_elementSetting(); // 엘리먼트 조정
						
						_opts.complete(_this, _itmNum); // 모든일이 완료되면 실행함수
					}
				});
			},

			// 엘리먼트 만들기
			_makeElement = function()
			{
				var str = '';
				str += '<div class="sliderkit-nav">';
				str += '<div class="sliderkit-nav-clip"></div>';
				str += '</div>';
				str += '<div class="sliderkit-panels"></div>';
				return str;
			},

			// 블럭생성 재귀함수
			_block = function(node, type)
			{
				var str = '';
				_itmNum = _opts.navitems == 0 ? node.children().length:_opts.navitems;

				switch(type) {
					case 'thum':
						for( var i = 0; i < _itmNum; i++ ) {
							var subject = $(node.children()[i]).find('txt1_value').text();
							str += '<li>';
							str += '<a href="#" title="' + subject + '"></a>';
							str += '</li>';
						}
						break;
					case 'img':
						for( var i = 0; i < _itmNum; i++ ) {
							var
								_node = $(node.children()[i]),
								subject = _node.find('txt1_value').text(),
								img = _node.find('img1_url').text(),
								url = _node.find('url1_value').text(),
								tar = _node.find('url1_target').text()
							;
							str += '<div class="sliderkit-panel">';
							if (url) { str += '<a href="' + url + '" target="' + tar + '">'; }
							str += '<img src="' + img + '" alt="' + subject + '" />';
							if (url) { str += '</a>'; }
							str += '</div>';
						}
						break;
				}
				return str;
			},

			// 엘리먼트 세팅
			_elementSetting = function()
			{
				_this.parent().width(_opts.width); // 슬라이드 레이아웃 사이즈 조절
				_this.width(_opts.width).height(_opts.height); // 슬라이드 사이즈 조절
			}
		;

		_init();
	};

	// 기본값
	$.fn.xmlToElement_002.defaults = {
		'url' : 'none',
		'errorMsg' : 'XML LOAD ERROR',
		'dataType' : 'xml',
		'complete' : function(){alert('XML LOAD COMPLETE')}
	};
	// XML to LI list Start
})(jQuery);