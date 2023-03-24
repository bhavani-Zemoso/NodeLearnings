const bcrypt = require('bcryptjs');
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

exports.getSignup = (req, res, next) => {
	res.render('auth/signup', {
		path: '/signup',
		docTitle: 'Signup',
		isAuthenticated: false,
	});
};

exports.postLogin = (req, res, next) => {
	//res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10;');
	const email = req.body.email;
	const password = req.body.password;
	User.findOne({ email: email })
		.then((user) => {
			if (!user) {
				return res.redirect('/login');
			}
			bcrypt
				.compare(password, user.password)
				.then((doMatch) => {
					if (doMatch) {
						req.session.isLoggedIn = true;
						req.session.user = user;
						return req.session.save((error) => {
							console.log(error);
							res.redirect('/');
						});
					}
					res.redirect('/login');
				})
				.catch((error) => {
					console.log(error);
					res.redirect('/login');
				});
		})
		.catch((error) => console.log(error));
};

exports.postSignup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;
	User.findOne({ email: email })
		.then((userDoc) => {
			if (userDoc) {
				return res.redirect('/signup');
			}
			return bcrypt
				.hash(password, 12)
				.then((hashedPassword) => {
					const user = new User({
						email: email,
						password: hashedPassword,
						cart: { items: [] },
					});
					return user.save();
				})
				.then((result) => {
					res.redirect('/login');
				});
		})
		.catch((error) => {
			console.log(error);
		});
};

exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		console.log(err);
		res.redirect('/');
	});
};
