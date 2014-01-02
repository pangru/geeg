
var assert = require('assert');
var util = require('util');
var crypto = require('crypto');

var _ = require('../node_modules/underscore');
var mysql = require('../node_modules/mysql');
var mysqlq = require('../node_modules/mysql-queues');

var console = require('../lib/global')(__filename);
var utils = require('./utils');
var ec = require('./ec');    // reserve E*


var db = module.exports = (function () {
    var client, conf;

    var open = function (cnf) {
        assert(_.isObject(cnf));

        var onDisconnect = function _onDisconnect() {
            client.on('error', function (err) {
                if (!err.fatal)
                    return;

                if (err.code !== 'PROTOCOL_CONNECTION_LOST')
                    throw err;

                console.log(err);
                client = mysql.createConnection(client.config);
                _onDisconnect();
                client.connect();
                mysqlq(client, false);
            });
        };

        conf = cnf;
        client = mysql.createConnection(conf);

        onDisconnect();

        client.connect();
        mysqlq(client, false);

        return this;
    };

    // optional cb
    var close = function (cb) {
        if (!client)
            return;
        client.end(function (err) {
            if (_.isFunction(cb))
                cb(err);
        });

        return this;
    };

    var _password = function (p) {
        return (crypto.createHash('sha1')).update(p).digest('hex');
    };

    var register = function (info, cb) {
        var trans;
        var userInfo, deviceInfo;
        var qu = 'INSERT INTO %s SET ?;';
        var qd = 'INSERT INTO %s SET ?;';

        qu = util.format(qu, conf.tabUser);
        qd = util.format(qd, conf.tabDevice);

        userInfo = {
            user_id:   info.userId,
            user_name: info.userName,
            _password: _password(info.password),
            // email:     info.email
        };

        deviceInfo = {
            user_id:       info.userId,
            device_id:     info.deviceId,
            device_name:   info.deviceName,
            device_type:   info.deviceType,
            phone_num:     info.phoneNum,
            // device_status: info.deviceStatus
        };

        onError = function (err) {
            if (err && trans.rollback) {
                trans.rollback();
                cb(err);
            }
        };

        trans = client.startTransaction();
        trans.query(qu, userInfo, onError)
             .query(qd, deviceInfo, onError)
             .commit(function (err) {
                 cb(err);
             });

        return this;
    };

    var user = function (userId, cb) {
        var q = 'SELECT * from %s WHERE user_id=%s;';

        q = util.format(q, conf.tabUser, client.escape(userId));
        client.query(q, function (err, row) {
            if (err || row.length === 0)
                cb(err, null);
            else {
                row = row[0];
                cb(null, {
                    userId:   row.user_id,
                    userName: row.user_name,
                    email:    row.email,
                    password: row._password
                });
            }
        });

        return this;
    };

    var device = function (usrDevId, cb) {
        var q = 'SELECT * from %s WHERE user_id=%s AND device_id=%s;';

        usrDevId = utils.usrDevId(usrDevId);

        q = util.format(q, conf.tabDevice, client.escape(usrDevId[0]), client.escape(usrDevId[1]));
        client.query(q, function (err, row) {
            if (err || row.length === 0)
                cb(err, null);
            else {
                row = row[0];
                cb(null, {
                    userId:       row.user_id,
                    deviceId:     row.device_id,
                    deviceStatus: row.device_status,
                    deviceType:   row.device_type,
                    deviceName:   row.device_name,
                    phoneNum:     row.phone_num,
                    // buddyList:    row.buddy_list
                });
            }
        });
    };

    // optional pushId
    var pid = function (usrDevId, pushId, cb) {
        var qs = 'SELECT push_id FROM device WHERE user_id=%s AND device_id=%s;';
        var qu = 'UPDATE device SET push_id=%s WHERE user_id=%s AND device_id=%s;';

        if (_.isFunction(pushId)) {
            cb = pushId;
            pushId = undefined;
        }

        usrDevId = utils.usrDevId(usrDevId);
        if (_.isObject(pushId)) {    // update
            qu = util.format(qu, client.escape(JSON.stringify(pushId)), client.escape(usrDevId[0]),
                             client.escape(usrDevId[1]));
            client.query(qu, cb);
        } else {    // select
            qs = util.format(qs, client.escape(usrDevId[0]), client.escape(usrDevId[1]));
            client.query(qs, function (err, row) {
                cb(err, (row.length === 0)? null: row[0].push_id);
            });
        }

        return this;
    };

    var login = function (info, cb) {
        user(info.userId, function (err, row) {
            if (err || !row || row.password !== _password(info.password)) {
                cb(err || ENOTFOUND);
                return;
            }
            device(info.userId + ':' + info.deviceId, function (err, row) {
                if (err || !row) {
                    cb(err || ENOTFOUND);
                    return;
                }
                pid(info.userId + ':' + info.deviceId, info.pushId, cb);
            });
        });

        return this;
    };
sion = function (sessionId, cb) {
        var q = 'SELECT app_key, server_name, url FROM %s WHERE session=%s;';
        q = util.format(q, conf.tabServer, client.escape(sessionId));

        client.query(q, function (err, row) {
            if (err || row.length === 0)
                cb(err, null);
            else {
                row = row[0];
                cb(null, {
                    udid: row.app_key + '$' + row.server_name,
                    url:  row.url
                });
            }
        });

        return this;
    };

    var server = function (appKey, cb) {
        var r = { svl: [] };
        var q = 'SELECT server_name, url FROM %s WHERE app_key=%s;';
        q = util.format(q, conf.tabServer, client.escape(appKey));

        client.query(q, function (err, row) {
            if (!err)
                for (var i = 0; i < row.length; i++)
                    r.svl.push({
                        nm:  row[i].server_name,
                        url: row[i].url
                    });
            cb(err, r);
        });
    };

    var existServer = function (userId, deviceId, cb) {
        var q = 'SELECT count(*) FROM %s WHERE app_key=%s AND server_name=%s;';

        q = util.format(q, conf.tabServer, client.escape(userId), client.escape(deviceId));
        console.log(q);
        client.query(q, function (err, row) {
            console.log(err, row);
            cb(err, (row && row[0])? +row[0]['count(*)'] > 0: null);
        });
    };

    var serverPushId = function (userId, deviceId, cb) {
        var q = 'SELECT push_url FROM %s WHERE app_key=%s AND server_name=%s;';

        q = util.format(q, conf.tabServer, client.escape(userId), client.escape(deviceId));
        console.log(q);
        client.query(q, function (err, row) {
            console.log(err, row);
            cb(err, (row && row[0])? row[0]['push_url']: null);
        });
    };

    // optional cb
    var close = function (cb) {
        if (!client)
            return;
        client.end(function (err) {
            if (_.isFunction(cb))
                cb(err);
        });

        return this;
    };


