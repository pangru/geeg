var assert = require('assert');
var crypto = require('crypto');
var util = require('util');

var _ = require('../node_modules/underscore');
var mysql = require('../node_modules/mysql');
var mysqlq = require('../node_modules/mysql-queues');

var db = module.exports = (function () {
  var client, conf;

  var open = function (cnf) {
    console.log('open %j', cnf.conf);
    assert(_.isObject(cnf));

    var onDisconnect = function _onDisconnect() {
      client.on('error', function (err) {
        console.log(err);
        if (!err.fatal)  return ;
        
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
    client = mysql.createConnection(conf.config);

    onDisconnect();

    client.connect();
    mysqlq(client, false);

    return this;
  };

  var close = function (callback) {
    if (!client) 
      return;
 
    client.end(function (err) {
      if (_.isFunction(callback)) 
        callback(err);
    });

    return this;
  };

  var register = function (info, callback) {
    console.log('called registered');

    var userInfo;
    var q = 'INSERT INTO %s SET ?;';

    q = util.format(q, conf.tabUser);
    console.log(q);

    userInfo = {
      name: info.name,
      email: info.email,
      password: info.password
    };

    client.query(q, userInfo, function (err, row) {
      console.log(err, row);
      callback(null, row);
    });

    return this;
  };

  var user = function (email, callback) {
    var q = 'SELECT * FROM %s WHERE email=%s;';

    q = util.format(q, conf.tabUser, client.escape(email));
    console.log(q);
    client.query(q, function (err, row) {
      if (err || row.length === 0) {

      } else {
        row = row[0];
        callback(null, {
          name: row.name,
          email: row.email
        });
      }
    });

    return this;
  };

  var login = function (info, callback) {
    var q = 'SELECT * FROM %s WHERE email=%s and password=%s';
    q = util.format(q, conf.tabUser, client.escape(info.email), client.escape(info.password));
    console.log(q);

    client.query(q, function (err, row) {
      if (err || row.length === 0) {
        console.log('user is empty');
      } else {
        row = row[0];
        callback(null, {
            name: row.name, 
	          email: row.email
        });
      }
    });

    return this;
  }

  var notice = function (params, callback) {
    console.log('%j', params);
    var q = "SELECT nid, title, body, name, create_date, read_cnt FROM %s INNER JOIN %s ON writer_email = email";

    if (params.nid) {
      q += " WHERE nid = " + params.nid;
    } else if (params.count) {
      q += " ORDER BY nid DESC LIMIT " + params.count;
    }

    q = util.format(q, conf.tabNotice, conf.tabUser);
    console.log(q);

    client.query(q, function (err, row) {
      if (err || row.length === 0) {
        console.log('notice is empty');
      } else {
        callback(null, row);
      }
    });
  };

  var insertNotice = function (info, callback) {
    console.log('%j', info);
    var q = 'INSERT INTO %s SET ?;';
    q = util.format(q, conf.tabNotice);
    console.log(q);

    client.query(q, info, function (err, row) {
      if (!err) {
        callback(null);
      } else {
        console.log('insert notice %j', err);
      }
    });
  };

  var calendar = function (count, callback) {
    var q = "SELECT eid, title, edate, place, create_date, writer_email, read_cnt FROM %s INNER JOIN %s ON writer_email = email ORDER BY eid DESC";
    if (count) {
      q += "  LIMIT " + count;
    }

    q = util.format(q, conf.tabEvent, conf.tabUser);
    console.log(q);

    client.query(q, function (err, row) {
      if (err || row.length === 0) {
        console.log('notice is empty');
      } else {
        callback(null, row);
      }
    });
  };

  return {
    open: open,
    close: close,
    register: register,
    user: user,
    notice: notice,
    insertNotice: insertNotice,
    calendar: calendar, 

    login: login
  };
})();