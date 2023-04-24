import express from 'express';

import { body } from 'express-validator';

import User from '../schemas/user';
import authController from '../controllers/auth';

const router = express.Router();

router.post(
	'/signup',
	[
		body('email', 'Please enter a valid email.')
			.isEmail()
			.custom(async (value) => {
				const user = await User.findOne({ email: value }).exec();
				if (user) return Promise.reject('Email address already exists!');
			})
			.normalizeEmail(),
		body('password', 'Password should have a minimum of 5 characters!')
			.trim()
			.isLength({ min: 5 }),
		body('username', 'Username is required').trim().notEmpty(),
		body('phone_number', 'Phone number is required')
			.trim()
			.isMobilePhone('en-IN'),
		body('pan_number').notEmpty().isString(),
	],
	authController.signUp
);

router.post(
	'/login',
	[
		body('email', 'Please enter a valid email.').isEmail().normalizeEmail(),
		body('password', 'Password should have a minimum of 5 characters!')
			.trim()
			.isLength({ min: 5 }),
	],
	authController.login
);

export default router;
