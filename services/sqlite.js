const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(process.env.SQLITE_DB || ':memory:');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS `services` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` VARCHAR(255), `provider` SMALLINT, `credentials` VARCHAR(500), `limit` BIGINT, used BIGINT DEFAULT 0)");
});

module.exports = db;