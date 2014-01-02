function log(o)
{
	
}

;(function($){
	// Navigation Event
	$.fn.scNavEvent_v0022 = function(options)
	{
		// 정의영역
		var
			defaults = {
				width : '100%'
				,dep1Height : 30
				,autoResize : 0
				,subTop : ['auto', 'auto']
				,subAniSpeed : 200
				,subAniType : 'none'
				,actv : []
				,complete : function(){}
			}
			,_this = $(this)
			,_opts = $.extend(defaults, options)
			,_total = _this.children().children().children().length
			,_dep1 = _this.children().children().children()

			// 초기화
			,_init = function()
			{
				_this.find('ul div').hide();

				if ( _opts.width == '100%' ) {
					_navResize();
				} else if ( _opts.width !== '' ) {
					_this.width(_opts.width).width(_dep1WidthAdjust());
				};

				if (_opts.autoResize && _opts.width !== '' ) {
					_dep1Resize(_dep1);
				}
				
				_dep1.children('a').height(_opts.dep1Height).css('line-height', _opts.dep1Height + 'px');

				_this.find('ul div').each(function(){
					var dep = parseInt($(this).attr('dep'));
					$(this).css('top', _opts.subTop[dep-1])
				});

				_mouseEventInit();

				// 메뉴 활성화 세팅
				try {
					if (_opts.actv[0]) { _activeNavSetting(); }
				} catch(e){}

				// 사이즈가 퍼센테이지로 되어있으면 서브메뉴 위치 조절하기
				// if (_opts.width.search('%') > 0 && dep1) {
				// 	$(window).resize(function(){
				// 		var
				// 			element = $(_dep1.parent().find('.active')[0]),
				// 			ul = element.children().next()
				// 		;
				// 		_navResize();
						
				// 		if (_opts.autoResize) { _dep1Resize(_dep1); }
						
				// 		_subNavLeftPosition(element, ul);
				// 	});
				// }
				
				_opts.complete(_this);
			}

			// 마우스 이벤트 초기화
			,_mouseEventInit = function()
			{
				// 마우스 이벤트 : Click
				if (_opts.mouseEventMethod == 'click') {
					// 부모클릭 이벤트
					_this.children().children().children().bind('click keyup', function(){
						if ($(this).hasClass('active') == false) {
							_mouseOut($(this).parent().children());
						}
						_mouseHover($(this));
						return false;
					});
					// 자식 엘리먼트 이벤트
					_this.find('li li').bind({
						mouseenter : function() {
							_mouseHover($(this));
						},
						mouseleave : function() {
							_mouseOut($(this));
						},
						click : function(e) {
							e.stopPropagation();
						}
					});
				
				// 마우스 이벤트 : Rollover
				} else {
					_this.find('li').bind('mouseenter keyup', function() {
						if (!$(this).hasClass('active')) {
							_mouseHover($(this));
						}
					}).bind('mouseleave', function() {
						_mouseOut($(this));
					});
					
					// 위치 활성화
					_this.bind({
						mouseleave : function() {
							var
								dep1 = _this.find('div[dep=0]>ul>li[act=1]'),
								dep2 = dep1.find('li[act=1]')
							;
							
							var timer1 = setTimeout(function() {
								dep1.addClass('active').find('>div').fadeIn(_opts.subAniSpeed);
								dep2.addClass('active');
								
								var
									img1 = dep1.children('a').children('img')
									,img2 = dep2.children('a').children('img')
								;
								
								if (img1.attr('over')) {
									img1.attr('src', img1.attr('over'));
								}
								if (img2.attr('over')) {
									img2.attr('src', img2.attr('over'));
								}
							}, 500);
						},
						mouseenter : function() {
							var dep = _this.find('div[dep=1]>ul>li[act=1]');
							dep.removeClass('active');
						}
					});
				}
			}

			// 마우스 오버
			,_mouseHover = function(element)
			{
				var
					ul = element.children().next(),
					lis = element.parent().find('>li')
				;

				lis.removeClass('active');

				_mouseOut(lis);
				_subNavLeftPosition(element, ul);
				
				switch(_opts.subAniType) {
					case 'slide':
						ul.slideDown(_opts.subAniSpeed);
						break;
					case 'fade':
						ul.fadeIn(_opts.subAniSpeed);
						break;
					default:
						ul.show();
						break;
				}
				element.addClass('active');
				element.children().css('color', _opts.dep1FontColor2);
				
				var img = element.children('a').children('img');
				if (img.attr('over')) {
					img.attr('src', img.attr('over'));
				}
			}

			// 마우스 아웃
			,_mouseOut = function(element)
			{
				var ul = element.children().next();
				switch(_opts.subAniType) {
					case 'slide':
						ul.slideUp(_opts.subAniSpeed);
						break;
					case 'fade':
						ul.fadeOut(_opts.subAniSpeed);
						break;
					default:
						ul.hide();
						break;
				}
				
				element.find('img').each(function(){
					if ($(this).attr('out')) {
						$(this).attr('src', $(this).attr('out'));
					}
				});
				element.removeClass('active');
			}

			// 서브 네비게이션 위치 정렬
			,_subNavLeftPosition = function(pobj, sobj)
			{
				if ((getInternetExplorerVersion() <= 7) && getInternetExplorerVersion() > 0) {
					// ie7 이하버전
					_dep1.css('position', 'relative');
					if (pobj.position() !== null) {
						//log(pobj.position().left)
						//if (_this.width() < (pobj.position().left + sobj.width())) {
							var _xpo = 0/* - pobj.position().left*/;
						//}
					}
				} else {
					// ie8 이상버전
					var _xpo = (pobj.position().left) + ((pobj.width() * 0.5) - (sobj.width() * 0.5));
					if ((_xpo < 0) && (_xpo + sobj.width()) > _this.children().width()) {
						_xpo = (_this.children().width() * 0.5) - (sobj.width() * 0.5);
					} else {
						if (_xpo < 0) {
							_xpo = 5;
						} else if ((_xpo + sobj.width()) > _this.children().width()) {
							_xpo = _this.children().width() - sobj.width() - 3;
						}
					}
				}
				sobj.css('left', _xpo + 'px');
			}

			// 네비게이션 가로 사이즈 조절
			,_navResize = function()
			{
				_this.width(_opts.width);
				// _this.width(_dep1WidthAdjust());
			}

			,_dep1WidthAdjust = function()
			{
				var border_left = parseInt(_this.css('border-left-width')),
					border_right = parseInt(_this.css('border-right-width')),
					wsize = _this.width() - border_left - border_right
				;
				return wsize;
			}

			// 1뎁스 엘리먼트 사이즈 조절
			,_dep1Resize = function(obj)
			{
				// obj.width(parseInt((_this.width()/_total)) + 'px');
			}

			// 메뉴활성화 세팅
			,_activeNavSetting = function()
			{
				var
					atv = _opts.actv
					,dep1 = _this.children().children().children().eq(atv[0]-1)
					,dep2 = dep1.children('div').children().children().eq(atv[1]-1)
				;

				var
					img1 = dep1.children('a').children('img')
					,img2 = dep2.children('a').children('img')
				;
				
				if (img1.attr('over'))
				{
					img1.attr('src', img1.attr('over'));
				}
				if (img2.attr('over'))
				{
					img2.attr('src', img2.attr('over'));
				}

				dep1.attr('act', 1).addClass('active').children('div').show();
				dep2.attr('act', 1).addClass('active');
				_subNavLeftPosition(dep1, dep1.children('div'));
			}
		;

		// 실행영역
		_init();
	};

	// 익스플로러 버전번호체크
	function getInternetExplorerVersion()
	{
		var rv = -1;
		if (navigator.appName == 'Microsoft Internet Explorer') {
			var ua = navigator.userAgent;
			var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) != null) {
				rv = parseFloat(RegExp.$1);
			}
		}
		return rv;
	} 
})(jQuery);
