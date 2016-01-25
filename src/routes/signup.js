const restify = require("restify");
const logger = require("../logger");
const models = require("../models");

function required(accessor, properties) {
  return (req, res, next) => {
    const has = req[accessor];
    if (!has) {
      return next(new restify.errors.BadRequestError(`Missing ${accessor} on request`));
    }
    properties.forEach(prop => {
      if (!has.hasOwnProperty(prop)) {
        return next(new restify.errors.BadRequestError(`Missing required ${accessor} parameter ${prop}`));
      }
    });
    next();
  };
}

function signupHandler(req, res, next) {
  models.user.create(req.body.email, req.body.password, (err, user) => {
    if (err) {
      logger.error(err);
      return next(new restify.InternalServerError("Error creating user"));
    }
    res.json(201, {
      email: user.email,
      id: user.id
    });
  });
}

module.exports = server => {
  server.post("/signup", [
    required("body", ["email", "password"]),
    signupHandler
  ]);
};
