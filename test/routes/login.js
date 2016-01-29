const test = require("tape");
const request = require("supertest")(require("../../src/server"));
const db = require("../db");
const models = require("../../src/models");
const helpers = require("../helpers");

test("/login should require email and password", t => {
  t.plan(2);
  request.post("/login")
    .send({ password: "password" })
    .expect(400)
    .end(err => t.error(err));

  request.post("/login")
    .send({ email: "user@example.com" })
    .expect(400)
    .end(err => t.error(err));
});

test("setup db", t => db.setup("users", t.end));
test("/login should 'log' an existing user in", t => {
  models.user.create("user@example.com", "password", (err, user) => {
    t.error(err);
    request.post("/login")
      .send({ email: "user@example.com", password: "password" })
      .expect(200)
      .end((err, res) => {
        t.error(err);
        helpers.onlyKeys(t, ["email", "id"], res.body);
        t.equal(res.body.id, user.id);
        t.equal(res.body.email, "user@example.com");
        t.end();
      });
  });
});

test("/login should fail with 401 for bad username or password", t => {
  t.plan(2);
  request.post("/login")
    .send({ email: "null@example.com", password: "password" })
    .expect(401)
    .end(err => t.error(err));

  request.post("/login")
    .send({ email: "user@example.com", password: "wrongpassword" })
    .expect(401)
    .end(err => t.error(err));
});
test("teardown", t => db.teardown(t.end));
