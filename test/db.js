if (!process.env.CIRCLECI) {
  const path = require("path");
  require("dotenv").load({ path: path.join(__dirname, "../.env") });
}

const dynamo = require("../scripts/dynamo")(["--inMemory", "--sharedDb"]);
module.exports = require("../src/db");
