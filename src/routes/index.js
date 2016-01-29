module.exports = server => {
  require("./signup")(server);
  require("./login")(server);
};
