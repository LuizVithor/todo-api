var sqlite3 = require('sqlite3');
var mkdirp = require('mkdirp');

mkdirp.sync('./var/db');

var db = new sqlite3.Database('./var/db/todos.db');

db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS todos ( \
    id INTEGER PRIMARY KEY, \
    title TEXT NOT NULL, \
    completed INTEGER, \
    userId string NOT NULL \
  )");
  db.run("CREATE TABLE IF NOT EXISTS users ( \
    id TEXT PRIMARY KEY, \
    name TEXT NOT NULL UNIQUE, \
    password TEXT NOT NULL, \
    profileImage TEXT \
  )");
});

module.exports = db;
