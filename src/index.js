if (process.env.NODE_ENV === "development") {
	const path = require("path");
	require("dotenv").load({ path: path.join(__dirname, "../.env") });
}

const restify = require("restify");
const server = restify.createServer();

server.get('/hello/:name', (req, res) => {
	res.send(`${process.env.EXAMPLE_ENV_VAR} ${req.params.name}`);
});

server.listen(process.env.PORT, function() {
	console.log(`${server.name} listening at ${server.url}`);
});
