"use strict";

const path = require("path");
require("dotenv").load({ path: path.join(__dirname, "../.env") });

const test = require("tape");
const dynamo = require("../scripts/dynamo");
let dbServer = null;

test("tests should work", assert => {
  assert.equal(5, 5);
  assert.end();
});

test("should start dynamo", assert => {
  dbServer = dynamo(["--inMemory", "--sharedDb"]);
  assert.ok(dbServer.pid);
  assert.end();
});

test("should connect to local dynamodb", assert => {
  assert.plan(3);
  const db = require("../src/db");
  assert.equal(db.client.endpoint.hostname, "localhost");
  db.client.listTables((err, tables) => {
    assert.error(err);
    assert.equal(tables.TableNames.length, [].length);
  });
});

test("should stop dynamo", assert => {
  dbServer.on("exit", () => assert.end());
  dbServer.kill();
});
