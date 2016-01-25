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

test("schemas", t => {
  t.test("Users", t => {
    db.with([require("../schemas/users")], (err, done) => {
      t.error(err);
      db.client.listTables((err, data) => {
        t.error(err);
        t.equal(data.TableNames.length, 1);
        t.equal(data.TableNames[0], "Users");
        done(t.end);
      });
    });
  });
});
