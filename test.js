var db = require('./lib/db');
var db_conf = require('./lib/db_config');

db.open(db_conf);

var info = {
name: 'lyk4707',
email: 'lyk4707@sm.ac.kr'
};


db.register(info, function (err) {
  if (!err) console.log(err);
  else console.log('registered');
});

/*
db.customer('pangru@naver.com', function (err, data) {
  if (err) console.log(err);
  else console.log(data);
});
*/
db.close();
