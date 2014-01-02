;(function($){
	// Value to LI list Start
	$.fn.navToList_v021 = function(options)
	{
		var
			defaults = {
				'code' : '00000000',
				'depthLimit' : 1,
				'errorMsg' : 'NO DATA',
				'classes' : ['dep1_txt','dep2_txt','dep3_txt'],
				'imgPrintDepth' : 0,
				'complete' : function(){}
			},
			_this = $(this),
			_dataList, // 아웃풋 데이터리스트
			_opts = $.extend(defaults, options),
			_code = _opts.code,
			_nv = 'navi_cate_',

			// 생성자 함수 (데이터 로드)
			_init = function()
			{
				eval('var dp' + 0 + '_dat = _varToObject(_code, ' + 0 + ')');
				_this.html(_block(eval('dp' + 0 + '_dat')));
				_this.find('li:first-child').addClass('first');
				_opts.complete(_this);
			},

			_errorMsg = function()
			{
				alert(_opts.errorMsg);
			}
			
			_varToObject = function(code, n)
			{
				try {
					var obj = {
						'dep' : n,
						'code' : eval(_nv + code + '_code'),
						'subject' : eval(_nv + code + '_menu_subject'),
						'url' : eval(_nv + code + '_link_url'),
						'urlTar' : eval(_nv + code + '_link_target'),
						'urlClick' : eval(_nv + code + '_link_onclick'),
						'btn1' : eval(_nv + code + '_bt1'),
						'btn2' : eval(_nv + code + '_bt2')
					};
					return obj;
				} catch(e) {
					return false;
				}
			},
			
			_block = function(obj)
			{
				var _str = '';

				_str += '<div dep="' + obj.dep + '">\n';
				_str += '<ul>\n';
				for(var i in obj.code) {
					var nxtNum = obj.dep + 1;
					var eventstr = '';

					_str += '<li>\n';
					_str += '<a onClick="' + obj.urlClick[i] + '" href="' + obj.url[i] + '" target="' + obj.urlTar[i] + '" class="' + _opts.classes[obj.dep] + '">';

					if (_opts.imgPrintDepth == 0) {
						_str += obj.subject[i];
					} else {
						if (_opts.imgPrintDepth > obj.dep) {
							if (obj.btn1[i]) {
								if (obj.btn2[i]) {
									eventstr = 'over="' + obj.btn2[i] + '" out="' + obj.btn1[i] + '"';
								}
								_str += '<img src="' + obj.btn1[i] + '" ' + eventstr + ' alt="' + obj.subject[i] + '"/>';
							} else {
								_str += obj.subject[i];
							}
						} else {
							_str += obj.subject[i];
						}
					}
					
					
					_str += '</a>\n';
					
					if ((obj.dep + 1) < _opts.depthLimit) {
						eval('var dp' + nxtNum + '_dat = _varToObject("' + obj.code[i] + '", ' + nxtNum + ')');
						if (eval('dp' + nxtNum + '_dat') != false) {
							_str += _block(eval('dp' + nxtNum + '_dat'));
						}
					}

					_str += '</li>\n';
				}
				_str += '</ul>\n';
				_str += '</div>\n';

				return _str;
			}
		;

		// init
		if (eval(_nv + _code + '_code')) {
			_init();
		} else {
			_errorMsg();
		}
	};
})(jQuery);