const test = require("tape");
const bcrypt = require("bcrypt");
const db = require("../db");
const models = require("../../src/models");

function hasUserFields(t, user) {
  ["id", "email", "hash", "created_at", "updated_at"].forEach(k => {
    t.ok(user.hasOwnProperty(k), `user should have property ${k}`);
  });
}

test("setup db", t => db.setup("users", t.end));
test("create user success", t => {
  models.user.create("user@example.com", "password", (err, user) => {
    t.error(err);
    t.equal(user.email, "user@example.com");
    hasUserFields(t, user);
    t.ok(bcrypt.compareSync("password", user.hash), "password should match");
    t.end();
  });
});

test("model.users.get returns user", t => {
  models.user.get("user@example.com", (err, user) => {
    t.error(err);
    t.equal(user.email, "user@example.com");
    hasUserFields(t, user);
    t.end();
  });
});

test("model.users.get returns null for no user", t => {
  models.user.get("null@example.com", (err, user) => {
    t.error(err);
    t.equal(user, null);
    t.end();
  });
});
test("teardown", t => db.teardown(t.end));
