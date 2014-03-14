/*
 *  Geeg create Server
 */
var _ = require('./node_modules/underscore');
var async = require('./node_modules/async');
var console = require('./node_modules/console-plus');
var config = require('konphyg')(__dirname + '/config');

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

app.configure(function () {
	app.use(favicon('./public/images/favicon.ico'));

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