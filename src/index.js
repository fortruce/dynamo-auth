if (process.env.NODE_ENV === "development") {
	const path = require("path");
	require("dotenv").load({ path: path.join(__dirname, "../.env") });
}

const server = require("./server");
const logger = require("./logger");
const db = require("./db");

if (process.env.NODE_ENV === "development") {
	logger.info("Spawning DynamoDB Local");
	const dynamo = require("../scripts/dynamo")(["--sharedDb"]);
}

server.listen(process.env.PORT, function() {
	logger.info(`${server.name} listening at ${server.url}`);
});
