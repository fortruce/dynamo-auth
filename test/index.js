"use strict";

const test = require("tape");
const db = require("./db");

test("ensure a clean run", t => {
  db.setup([], () => {
    db.teardown(t.end);
  });
});

test("should connect to local dynamodb", t => {
  t.equal(db.client.endpoint.hostname, "localhost");
  db.client.listTables((err, tables) => {
    t.error(err);
    t.equal(tables.TableNames.length, [].length);
    t.end();
  });
});

test("setup db", t => db.setup("users", t.end));
test("Users", t => {
  db.client.listTables((err, data) => {
    t.error(err);
    t.equal(data.TableNames.length, 1);
    t.equal(data.TableNames[0], "Users");
    t.end();
  });
});
test("teardown", t => db.teardown(t.end));
