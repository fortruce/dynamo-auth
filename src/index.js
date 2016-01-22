if (process.env.NODE_ENV === "development") {
	const path = require("path");
	require("dotenv").load({ path: path.join(__dirname, "../.env") });
}

const restify = require("restify");
const bunyan = require("bunyan");

const server = restify.createServer();
const logger = bunyan.createLogger({ name: "dynamo-auth" })

server.listen(process.env.PORT, function() {
	console.log(`${server.name} listening at ${server.url}`);
});
