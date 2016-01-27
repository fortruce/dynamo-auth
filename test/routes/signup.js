const test = require("tape");
const request = require("supertest")(require("../../src/server"));
const db = require("../db");

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

test("setup db", t => db.setup("users", t.end));
test("/signup should validate email", t => {
  const emails = {
    201: [
      "foo.bar@baz.com",
      "foo@gmail.com",
      "xyz+test@cookies.org"
    ],
    400: [
      "xyz",
      "",
      "foo@",
      "foo@bar"
    ]
  };
  const total = Object.keys(emails).map(k => emails[k].length).reduce((a,b) => a + b);
  t.plan(total);
  Object.keys(emails).forEach(code => {
    emails[code].forEach(email => {
      request.post("/signup")
        .send({ email: email, password: "password" })
        .expect(parseInt(code))
        .end(err => t.error(err, `${email} should ${code}`));
    });
  });
});

test("/signup should validate password", t => {
  const valid = [
    "testPass$!@ASD",
    "minimum8",
    "maximum64aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
  ];
  const invalid = [
    "",
    "minIs8-",
    "maximum64aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
  ];
  t.plan(valid.length + invalid.length);
  valid.forEach((pass, i) => {
    request.post("/signup")
      .send({ email: `valid${i}@example.com`, password: pass })
      .expect(201)
      .end(err => t.error(err, `password ${pass} should be valid`));
  });
  invalid.forEach((pass, i) => {
    request.post("/signup")
      .send({ email: `invalid${i}@example.com`, password: pass })
      .expect(400)
      .end(err => t.error(err, `password ${pass} should be invalid`));
  });
});
test("teardown", t => db.teardown(t.end));

test("setup db", t => db.setup("users", t.end));
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
