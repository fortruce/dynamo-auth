"use strict";

const child_process = require("child_process");

module.exports = (args, opts) => {
  args = args || [];
  opts = opts || {};
  return child_process.spawn(
    "java",
    [
      `-Djava.library.path=${process.env.DYNAMODB_PATH}/DynamoDBLocal_lib`,
      `-jar`,
      `${process.env.DYNAMODB_PATH}/DynamoDBLocal.jar`,
      "--port",
      `${process.env.DYNAMODB_PORT}`
    ].concat(args),
    Object.assign({}, { env: process.env }, opts)
  );
}
