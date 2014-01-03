var db = require('./db');
var db_conf = require('./db_config');
var async = require('async');

var dbconn = module.exports = (function () {
  var open = function () {
    db.open(db_conf);
  };

  var close = function () {
    db.close();
  };

  var isMember = function (info) {
    console.log('isMember ... ');

     db.user(info.email, function (err, data) {
        console.log(data);

        if (data) 
          return true;
      });
  };

  var register = function (info, callback) {
    console.log('register .. %j', info, callback);

    async.waterfall([
      function(cb) {
        var result = isMember(info);
      console.log(callback);
        cb(null, result);
      },
      function(arg1, cb) {
        console.log(arguments);

        if (!arg1) {
          db.register(info, function (err, data) {
            console.log('register .. finished');
            cb(err, data);
          });
        }          
      }
    ], function (err, result) {
      callback(err, result);
    });
  };

  var login = function (info, callback) {
    console.log('login .. %j', info);

    db.login(info, callback);
  };

  var notice = function (count, callback) {
    console.log('dbconn notice');
    db.notice(count, callback);
  };

  var writeNotice = function (info, callback) {
    console.log('dbconn insert notice');
    db.insertNotice(info, callback);
  };

  var calendar = function (count, callback) {
    console.log('dbconn calendar');
    db.calendar(count, callback);
  }

  return {
    open: open,
    close: close,

    isMember: isMember,
    register: register,
    login: login,
    notice: notice,
    writeNotice: writeNotice,
    calendar: calendar
  };
})();
