// Exports a server ready to listen
const restify = require("restify");

const server = restify.createServer({
  name: "DynamoAuth",
  log: require("./logger")
});

server.use(restify.bodyParser());

require("./routes")(server);

module.exports = server;
