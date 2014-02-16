var rpc = require('node-json-rpc');
var options = {
	port: 9000,
	host: localhost,
	path: '/',
	strict: true
};
var rpc_server = new rpc.Server(options);

rpc_server.addMethod('/upload', function (param, callback) {
	var error, result;
	if (param.length === 2) {
		result = param[0] + param[1];
	} else if (param.length > 2) {
		result = 0;
		param.forEach(function (v, i) {
			result += v;
		});
	} else {
		error = { code: -32603, message: 'invalid params'};
	}

	callback(error, result);
}) ;

(function ()  {
	rpc_server.start(function (error) {
		if (error) throw error;
		else console.log('Server running...');
	})
})();
