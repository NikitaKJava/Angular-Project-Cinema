const pg = require('pg');
//or native libpq bindings
//var pg = require('pg').native

const conString = "postgres://nynjzebi:rcJ-brIKrVag1w3F6-qSKCarKKhQWx67@mel.db.elephantsql.com/nynjzebi" 
const client = new pg.Client(conString);
client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
});

module.exports = client;