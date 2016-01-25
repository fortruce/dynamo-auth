const test = require("tape");
const request = require("supertest")(require("../src/server"));

test("routes", t => {
  t.test("/signup", t => {
    t.test("should require email and password", t => {
      request.post("/signup")
        .expect(400)
        .end(err => t.error(err, "bad request"));

      request.post("/signup")
        .send({ email: "", password: "" })
        .expect(201)
        .end(err => t.error(err, "good request"));

      t.end();
    });

    t.test("should create user", t => {
      request.post("/signup")
        .send({ email: "user@example.com", password: "password" })
        .expect(201)
        .end((err, res) => {
          t.error(err);
          t.ok(res.body.email);
          t.notOk(res.body.hash);
          t.notOk(res.body.password);
          // TODO add tests that spy model.users.create
          t.end();
        });
    });
  });
});
