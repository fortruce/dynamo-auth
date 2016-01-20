import restify from "restify";

const server = restify.createServer();
server.get('/hello/:name', (req, res) => {
	res.send(`hello ${req.params.name}`);
});

server.listen(8080, function() {
	console.log(`${server.name} listening at ${server.url}`);
	console.log(process.env.EXAMPLE_ENV_VAR);
});
