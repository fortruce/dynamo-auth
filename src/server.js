// Exports a server ready to listen
const restify = require("restify");

const server = restify.createServer();
module.exports = server;
