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

test("routes", t => {
  t.test("/signup", t => {
    t.test("should require email and password", t => {
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

      t.end();
    });

    t.test("should create user", t => {
      db.with([require("../schemas/users")], (err, done) => {
        request.post("/signup")
          .send({ email: "user@example.com", password: "password" })
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
                done(t.end);
              });
          });
      });
    });
  });
});
