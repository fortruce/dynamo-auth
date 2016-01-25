const bcrypt = require("bcrypt");
const uuid = require("uuid");
const db = require("../db");

function createUser(email, password, cb) {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return cb(err);
    }

    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        return cb(err);
      }

      const user = {
        id: uuid.v4(),
        email: email,
        hash: hash,
        created_at: (new Date()).getTime(),
        updated_at: null
      };

      db.table("Users")
        .insert(user, err => {
          if (err) {
            return cb(err);
          }
          cb(null, user);
        });
    });
  });
}

function getUser(email, cb) {
  db.table("Users")
    .index("EmailIndex")
    .where("email").eq(email)
    .query((err, data) => {
      if (err) {
        cb(err);
      }
      cb(null, data[0] || null);
    });
}

module.exports = {
  create: createUser,
  get: getUser
};
