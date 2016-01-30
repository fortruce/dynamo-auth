const restify = require("restify");
const models = require("../models");
const logger = require("../logger");
const validators = require("../lib/validators");

function loginUser(req, res, next) {
  models.user.authenticate(req.body.email, req.body.password, (err, user) => {
    if (err) {
      logger.error(err);
      return next(new restify.InternalServerError("Error authenticating user"));
    }
    if (!user) {
      return next(new restify.UnauthorizedError("Incorrect username and/or password"));
    }
    res.json(200, {
      email: user.email,
      id: user.id
    });
    return next();
  });
}

module.exports = server => {
  server.post("/login", [
    validators.required("body", ["email", "password"]),
    loginUser
  ]);
};
