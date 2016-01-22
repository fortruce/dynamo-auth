const bunyan = require("bunyan");
const logger = bunyan.createLogger({ name: "dynamo-auth" })
module.exports = logger;
