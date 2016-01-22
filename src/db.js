// Exports a DB connection instance
const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
}
if (process.env.DYNAMODB_ENDPOINT) {
  credentials.endpoint = process.env.DYNAMODB_ENDPOINT;
}
module.exports = require("aws-dynamodb")(credentials);
