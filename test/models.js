const test = require("tape");
const bcrypt = require("bcrypt");
const db = require("./db");
const models = require("../src/models");

function hasUserFields(t, user) {
  ["id", "email", "hash", "created_at", "updated_at"].forEach(k => {
    t.ok(user.hasOwnProperty(k), `user should have property ${k}`);
  });
}

test("user model", t => {
  db.with([require("../schemas/users")], (err, done) => {
    t.test("create user success", t => {
      models.user.create("user@example.com", "password", (err, user) => {
        t.error(err);
        t.equal(user.email, "user@example.com");
        hasUserFields(t, user);
        t.ok(bcrypt.compareSync("password", user.hash), "password should match");
        t.end();
      });
    });

    t.test("get user", t => {
      t.test("returns user", t => {
        models.user.get("user@example.com", (err, user) => {
          t.error(err);
          t.equal(user.email, "user@example.com");
          hasUserFields(t, user);
          t.end();
        });
      });

      t.test("returns null for no user", t => {
        models.user.get("null@example.com", (err, user) => {
          t.error(err);
          t.equal(user, null);
          t.end();
        });
      });
    });

    t.test("teardown", t => done(t.end));
  });
});
