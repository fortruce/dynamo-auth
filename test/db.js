if (!process.env.CIRCLECI) {
  const path = require("path");
  require("dotenv").load({ path: path.join(__dirname, "../.env") });
}
require("../scripts/dynamo")(["--inMemory", "--sharedDb"]);

const async = require("async");
const db = require("../src/db");

function setup(schemas, cb) {
  async.parallel(schemas.map(schema => {
    return cb => db.client.createTable(schema, cb);
  }), cb);
}

function teardown(cb) {
  db.client.listTables((err, data) => {
    if (err) {
      cb(err);
    }
    async.parallel(data.TableNames.map(table => {
      return cb => db.client.deleteTable({ TableName: table}, cb);
    }), cb);
  });
}

db.with = function(schemas, fn) {
  function done(cb) {
    teardown(cb);
  }

  setup(schemas, err => {
    fn(err, done);
  });
};

module.exports = db;
