/*
 *  geeg controller
 *  분산 고려 필요 ... 
 */

var _ = require('./node_modules/underscore');
var argv = require('./node_modules/optimist').argv;

(function () {
	var conf, v;
	var sn = {
		ls: 'log-in auth server',
		vs: 'view routing server',
		fs: 'file up/download server'
	};

	var usage = function () {
		console.log('Usage: geeg-ctrl <ls|vs|fs|all> <start|stop|stat>\n' +
			        'Start, stop or probe incus server.\n');
		console.log('For bug reporting instrunctions, please see\n' +
			         'jinsa2010@naver.com');
		process.exit();
	};

	var done = function () {
		console.log('done successfully');
	};

	//assert(argv);   존재의 이유 찾아보자!!
	conf = { port: 90000 };

	if (argv._.length !== 2 || (!sn[argv._[0]] && argv._[0] !== 'all'))
		usage();

	switch(argv._[1]) {
		case 'start':
			v = 'starting';
			cb = done;
			break;
		case 'stop':
			v = 'stopping';
			cb = done;
			break;
		case 'stat':
			v = 'probing';
			cb = function (stat) {
				console.log(sn[argv._[0]]) + ' is %s running', (stat)? '': 'not ');
			}
			break;
		default:
			usage();
			break;
	}

	// 분산 처리 고려 필요...
})();