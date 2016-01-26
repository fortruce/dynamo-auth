const test = require("tape");
const request = require("supertest")(require("../src/server"));
const db = require("./db");

function onlyKeys(t, keys, obj) {
  keys.every(key => {
    t.ok(obj.hasOwnProperty(key), `Object missing property ${key}`);
  });
  Object.keys(obj).forEach(key => {
    if (keys.indexOf(key) === -1) {
      t.fail(`Object has unwanted property ${key}`);
    }
  });
}

test("/signup should require email and password", t => {
  t.plan(3);
  request.post("/signup")
    .expect(400)
    .end(err => t.error(err));

  request.post("/signup")
    .send({ email: "user@example.com" })
    .expect(400)
    .end(err => t.error(err));

  request.post("/signup")
    .send({ password: "password" })
    .expect(400)
    .end(err => t.error(err));
});

test("setup db", t => db.setup([require("../schemas/users")], t.end));
test("/signup should create user", t => {
  request.post("/signup")
    .send({ email: "user@example.com", password: "different" })
    .expect(201)
    .end((err, res) => {
      t.error(err);
      onlyKeys(t, ["email", "id"], res.body);

      db.table("Users")
        .index("EmailIndex")
        .where("email").eq(res.body.email)
        .query((err, data) => {
          t.error(err);
          t.equal(data.length, 1);
          t.end();
        });
    });
});

test("/signup should fail if user exists", t => {
  request.post("/signup")
    .send({ email: "user@example.com", password: "password" })
    .expect(400)
    .end(err => {
      t.error(err);
      t.end();
    });
});
test("teardown", t => db.teardown(t.end));
