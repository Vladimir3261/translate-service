/**
 *
 * @type {sqlite3.Database|sqlite3.Database}
 */
const sqlite = require('./sqlite');

/**
 * Database class
 */
class DB {
    insert(table, data) {
        let keys = Object.keys(data).map(key => "`"+key+"`");
        let values = Object.values(data);
        let valuePlaceholders = [values.length].fill('?', 0, values.length).join(',');

         const stmt = sqlite.prepare(`INSERT INTO services(${keys.join(',')}) VALUES(${valuePlaceholders})`);
         stmt.run(... values);
         stmt.finalize();
    }

    find(query) {
        return new Promise((resolve, reject) => {
            sqlite.get(query, (err, data) => {
                if (err) {
                    reject(err);
                } else  {
                    resolve(data)
                }
            });
        });
    }
}

module.exports = DB;