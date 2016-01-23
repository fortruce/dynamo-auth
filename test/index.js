"use strict";

const test = require("tape");
const db = require("./db");

test("should connect to local dynamodb", t => {
  t.equal(db.client.endpoint.hostname, "localhost");
  db.client.listTables((err, tables) => {
    t.error(err);
    t.equal(tables.TableNames.length, [].length);
    t.end();
  });
});
