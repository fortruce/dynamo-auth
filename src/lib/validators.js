const restify = require("restify");

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

module.exports = {
  required: required
};
