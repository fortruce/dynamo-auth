const restify = require("restify");
const validator = require("email-validator");
const logger = require("../logger");
const models = require("../models");
const validators = require("../lib/validators");

function validateEmail(req, res, next) {
  if (validator.validate(req.body.email)) {
    return next();
  }
  return next(new restify.BadRequestError(`Invalid email`));
}

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 64;
function validatePassword(req, res, next) {
  const tooShort = req.body.password.length < PASSWORD_MIN_LENGTH;
  const tooLong = req.body.password.length > PASSWORD_MAX_LENGTH;
  if (tooShort || tooLong) {
    return next(new restify.BadRequestError(`Password must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters`));
  }
  return next();
}

function userDoesNotExist(req, res, next) {
  models.user.get(req.body.email, (err, exists) => {
    if (err) {
      logger.error(err);
      return next(new restify.InternalServerError("Error querying user"));
    }
    if (exists) {
      return next(new restify.BadRequestError("User already exists"));
    }
    next();
  });
}

function createUser(req, res, next) {
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
    validators.required("body", ["email", "password"]),
    validateEmail,
    validatePassword,
    userDoesNotExist,
    createUser
  ]);
};
