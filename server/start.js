// server starts
(function () {
    var pkey, cert;
    var port = process.env.PORT || 30080;
    var fport = process.env.FPORT || 56565;

    try {
        pkey = fs.readFileSync(confKey.pkey).toString();
        cert = fs.readFileSync(confKey.cert).toString();
    } catch(e) {
        console.log(e);
        process.exit();
    }

    rhelper(app).setParam();

    process.on('SIGINT', function () {
        exit();
    });

    async.waterfall([
        function (cb) {
            mongo.open(confMongo, cb);
        },
        function (cb) {
            console.log('mongo DB opened');
            redis.open(confRedis, mongo, cb);
        }
    ], function (err, result) {
        if(err) {
            console.log(err);
            exit();
        }
        console.log('redis opened');
        db.open(confDB);

        if(loc === 'INT') {
            https.createServer({ key: pkey, cert: cert }, app).listen(port);
            fapp.listen(fport);
        }
        else {
            app.listen(port);
        }

        // app.listen(port);
        console.log('Express server listening on port %d in %s mode', port, nodeenv);

        dserver.listen(confRpc.port, 'localhost');
        console.log('Control server listening on port ' + confRpc.port);

        ls.start();
        ps.start();
        bs.start();
        ms.start(redis.channel);
        fls.start(mongo);
    });
})();

