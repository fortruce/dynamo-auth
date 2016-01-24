if (process.env.NODE_ENV === "development") {
  const path = require("path");
  require("dotenv").load({ path: path.join(__dirname, "../.env") });
}

const server = require("./server");
const logger = require("./logger");

if (process.env.NODE_ENV === "development") {
  logger.info("Spawning DynamoDB Local");
  require("../scripts/dynamo")(["--sharedDb"]);
}

server.listen(process.env.PORT, () => {
  logger.info(`${server.name} listening at ${server.url}`);
});
