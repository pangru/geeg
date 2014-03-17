/*
 *  Geeg create Server
 */
var _ = require('./node_modules/underscore');
var async = require('./node_modules/async');
var config = require('konphyg')(__dirname + '/config');
var mdconf = require('./node_modules/mdconf');

var express = require('./node_modules/express');
var app = express();
var ls = require('./ls/ls')(app);

// initialization
var exit = function () {
	// mongodb stop
	// redis stop 
	// mariadb stop

	// server list~ stop

	process.exit();
};

// Express configurations
app.configure(function () {
//	app.use(favicon('./public/images/favicon.ico'));
  app.use(express.static(__dirname + '/public'));
  app.use(express.logger({ buffer: 5000 }));
  app.use(express.bodyParser());
  app.use(express.methodOOverride());
  app.use(function (req, res, next) {
    var _send = res.send;
    res.send = function () {
      if (arguments.length === 1 && _.isFinite(arguments[0]))
        _send.call(res, arguments[0], '');
      else
        _send.apply(res, arguments);
    };
    next();
  });
  app.use(app.router);
});

// server start!!
(function () {
	//set port
	var port = 9000;

	process.on('SIGINT', function () {
		exit();
	})

	async.waterfall([
		function (cb) {
			//db 설정
			// mongoconn library open
		},
		function (cb) {
			console.log('mongo DB opend');
			// redis DB library open
		}
	], function (err, result) {
		if (err) {
			console.log(err);
			exit();
		}

		// maria DB library open
		
		// app server start
		app.listen(port);

		console.log('Express server listening on port %d in %s mode', port, nodeenv);

		ls.start();
//		vs.start();
//		fs.start();
	});

})();