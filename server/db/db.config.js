let sql = require('mysql2');

let con = sql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'restaurant'
}
)

module.exports = { con };