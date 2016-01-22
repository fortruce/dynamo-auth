if (process.env.NODE_ENV === "development") {
	const path = require("path");
	require("dotenv").load({ path: path.join(__dirname, "../.env") });
}

const restify = require("restify");
const logger = require("./logger");

const server = restify.createServer();

server.listen(process.env.PORT, function() {
	logger.info(`${server.name} listening at ${server.url}`);
});
