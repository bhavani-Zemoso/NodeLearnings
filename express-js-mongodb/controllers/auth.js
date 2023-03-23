const User = require('../schemas/user');

exports.getLogin = (req, res, next) => {
	// const cookie = req.get('Cookie');
	// let isLoggedIn;
	// if(cookie)
	// 	isLoggedIn = req.get('Cookie').split('=')[1];
	// console.log(isLoggedIn)
	console.log(req.session.isLoggedIn);
	res.render('auth/login', {
		path: '/login',
		docTitle: 'Login',
		isAuthenticated: false,
	});
};

exports.postLogin = (req, res, next) => {
	//res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10;');

	User.findById('6412cc233843d882d09bc405')
		.then((user) => {
			req.session.isLoggedIn = true;
			req.session.user = user;
			req.session.save((error) => {
				console.log(error);
				res.redirect('/');
			});
		})
		.catch((error) => console.log(error));
};

exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		console.log(err);
		res.redirect('/');
	});
};
