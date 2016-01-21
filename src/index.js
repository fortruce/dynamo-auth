if (process.env.NODE_ENV === "development") {
	require("dotenv").load();
}

import restify from "restify";

const server = restify.createServer();
server.get('/hello/:name', (req, res) => {
	res.send(`${process.env.EXAMPLE_ENV_VAR} ${req.params.name}`);
});

server.listen(process.env.PORT, function() {
	console.log(`${server.name} listening at ${server.url}`);
});
