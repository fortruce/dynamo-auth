"use strict";

if (!process.env.CIRCLECI) {
  const path = require("path");
  require("dotenv").load({ path: path.join(__dirname, "../.env") });
}
require("../scripts/dynamo")(["--inMemory", "--sharedDb"]);

const async = require("async");
const db = require("../src/db");

let _isSetup = false;

function setup(schemas, cb) {
  if (_isSetup) {
    throw new Error("Cannot setup twice.\nAre you missing a previous teardown?");
  }
  _isSetup = true;
  if (Object.getPrototypeOf(schemas) !== Array.prototype) {
    schemas = [schemas];
  }
  schemas = schemas.map(schema => {
    return typeof schema === "string" ? require(`../schemas/${schema}`) : schema;
  });

  async.parallel(schemas.map(schema => {
    return cb => db.client.createTable(schema, err => cb(err));
  }), cb);
}

function teardown(cb) {
  if (!_isSetup) {
    throw new Error("Teardown called without matching setup.\nAre you missing a corresponding setup call?");
  }
  _isSetup = false;
  db.client.listTables((err, data) => {
    if (err) {
      cb(err);
    }
    async.parallel(data.TableNames.map(table => {
      return cb => db.client.deleteTable({ TableName: table}, err => cb(err));
    }), cb);
  });
}

db.setup = setup;
db.teardown = teardown;

module.exports = db;
