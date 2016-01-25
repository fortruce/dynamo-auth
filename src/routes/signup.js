const restify = require("restify");

function required(accessor, properties) {
  return (req, res, next) => {
    const has = req[accessor];
    if (!has) {
      res.send(new restify.errors.BadRequestError(`Missing ${accessor} on request`));
    }
    properties.forEach(prop => {
      if (!has.hasOwnProperty(prop)) {
        res.send(new restify.errors.BadRequestError(`Missing required ${accessor} parameter ${prop}`));
      }
    });
    next();
  };
}

function signupHandler(req, res) {
  res.json(201, { email: req.body.email });
}

module.exports = server => {
  server.post("/signup", [
    required("body", ["email", "password"]),
    signupHandler
  ]);
};
