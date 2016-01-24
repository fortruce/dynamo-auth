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
  t.test("users", t => {
    const userSchema = require("../schemas/users");
    db.client.createTable(userSchema, (err, data) => {
      t.error(err);
      const table = data.TableDescription;
      const attributes = table.AttributeDefinitions.map(attr => attr.AttributeName);
      t.equal(table.TableName, userSchema.TableName);
      t.equal(attributes.length, 2);
      t.ok(attributes.indexOf("id") !== -1);
      t.ok(attributes.indexOf("created_at") !== -1);
      t.end();
    });
  });
});
