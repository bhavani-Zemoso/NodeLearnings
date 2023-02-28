const requestHandler = (request, response) => {
	const url = request.url;
	const method = request.method;

	if (url === '/') {
		response.write('<html>');
		response.write('<head><title>Home page</title></head>');
		response.write('<body>');
		response.write('<h1>Hello User</h1>');
		response.write(
			'<form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Send</button></form>'
		);
		response.write('</body>');
		response.write('</html>');
		return response.end();
	}

	if (url === '/users') {
		response.write('<html>');
		response.write('<head><title>Home page</title></head>');
		response.write('<body><ul><li>User1</li><li>User2</li></ul></body>');
		response.write('</html>');
		return response.end();
	}

	if (url === '/create-user' && method === 'POST') {
        const body = [];
        request.on('data', (chunk) => {
            body.push(chunk);
        });

        return request.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const username = parsedBody.split('=')[1];
            console.log(username);
            response.writeHead(302, {'Location': '/'})
        })
	}
};

exports.handler = requestHandler;
