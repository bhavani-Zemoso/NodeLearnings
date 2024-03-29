const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const dotenv = require('dotenv');
const { validationResult } = require('express-validator');

dotenv.config();

const { SENDGRID_API_KEY } = process.env;

const User = require('../schemas/user');

const transporter = nodemailer.createTransport(
	sendgridTransport({
		auth: {
			api_key: SENDGRID_API_KEY,
		},
	})
);

exports.getLogin = (req, res, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/login', {
		path: '/login',
		docTitle: 'Login',
		errorMessage: message,
		oldInput: {
			email: '',
			password: '',
		},
		validationErrors: []
	});
};

exports.getSignup = (req, res, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/signup', {
		path: '/signup',
		docTitle: 'Signup',
		errorMessage: message,
		oldInput: {
			email: '',
			password: '',
			confirmPassword: '',
		},
		validationErrors: [],
	});
};

exports.postLogin = (req, res, next) => {
	//res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10;');
	const email = req.body.email;
	const password = req.body.password;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).render('auth/login', {
			path: '/login',
			docTitle: 'Login',
			errorMessage: errors.array()[0].msg,
			oldInput: { email: email, password: password },
			validationErrors: errors.array(),
		});
	}
	User.findOne({ email: email })
		.then((user) => {
			if (!user) {
				return res.status(422).render('auth/login', {
					path: '/login',
					docTitle: 'Login',
					errorMessage: 'Invalid email or password',
					oldInput: { email: email, password: password },
					validationErrors: [{ param: 'email' }, { param: 'password' }],
				});
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
					return res.status(422).render('auth/login', {
						path: '/login',
						docTitle: 'Login',
						errorMessage: 'Invalid email or password',
						oldInput: { email: email, password: password },
						validationErrors: [{ param: 'email' }, { param: 'password' }],
					});
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
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors);
		return res.status(422).render('auth/signup', {
			path: '/signup',
			docTitle: 'Signup',
			errorMessage: errors.array()[0].msg,
			oldInput: {
				email: email,
				password: password,
				confirmPassword: confirmPassword,
			},
			validationErrors: errors.array(),
		});
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
			return transporter.sendMail({
				to: email,
				from: 'bhavanisomanchi06@gmail.com',
				subject: 'Signup succeeded!',
				html: '<h1>You successfully signed up!</h1>',
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

exports.getReset = (req, res, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/reset', {
		path: '/reset',
		docTitle: 'Reset Password',
		errorMessage: message,
	});
};

exports.postReset = (req, res, next) => {
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			return res.redirect('/reset');
		}
		const token = buffer.toString('hex');
		User.findOne({ email: req.body.email })
			.then((user) => {
				if (!user) {
					req.flash('error', 'No account with that email found.');
					return res.redirect('/reset');
				}
				user.resetToken = token;
				user.resetTokenExpiration = Date.now() + 3600000;
				return user.save();
			})
			.then((result) => {
				res.redirect('/');
				console.log(req.body.email);
				return transporter.sendMail({
					to: req.body.email,
					from: 'bhavanisomanchi06@gmail.com',
					subject: 'Password reset',
					html: `
					<p> You requested a password reset </p>
					<p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password. </p>`,
				});
			})
			.catch((error) => {
				console.log(error);
			});
	});
};

exports.getNewPassword = (req, res, next) => {
	const token = req.params.token;
	User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
		.then((user) => {
			let message = req.flash('error');
			if (message.length > 0) {
				message = message[0];
			} else {
				message = null;
			}
			res.render('auth/new-password', {
				path: '/new-password',
				docTitle: 'New Password',
				errorMessage: message,
				userId: user._id.toString(),
				passwordToken: token,
			});
		})
		.catch((error) => console.log(error));
};

exports.postNewPassword = (req, res, next) => {
	const newPassword = req.body.password;
	const userId = req.body.userId;
	const passwordToken = req.body.passwordToken;
	let resetUser;

	User.findOne({
		resetToken: passwordToken,
		resetTokenExpiration: {
			$gt: Date.now(),
			_id: userId,
		},
	})
		.then((user) => {
			resetUser = user;
			bcrypt.hash(newPassword, 12);
		})
		.then((hashedPassword) => {
			resetUser.password = hashedPassword;
			resetUser.resetToken = undefined;
			resetUser.resetTokenExpiration = undefined;
			return resetUser.save();
		})
		.then((result) => {
			res.redirect('/login');
		})
		.catch((error) => console.log(error));
};
