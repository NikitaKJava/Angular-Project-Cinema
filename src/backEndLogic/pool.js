const { Pool } = require('pg');
const cfg = require('./config.json')

//or native libpq bindings
//var pg = require('pg').native

// const conString = 'postgres://nynjzebi:rcJ-brIKrVag1w3F6-qSKCarKKhQWx67@mel.db.elephantsql.com/nynjzebi';

const pool = new Pool({
    host: cfg.database.host,
    user: cfg.database.user,
    password: cfg.database.password,
    database: cfg.database.db
});
// pool.connect(function(err) {
//     if (err) {
//         return console.error('could not connect to postgres', err);
//     }
// });

module.exports = pool;
