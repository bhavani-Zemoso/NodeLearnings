import express, { NextFunction } from 'express';

import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const { JWT_SECRET } = process.env;

import User from '../schemas/user';

const signUp = async (
	request: express.Request,
	response: express.Response,
	_next: NextFunction
) => {
	const errors = validationResult(request);
	if (!errors.isEmpty()) {
		const error = new Error('Validation failed.');
		error.statusCode = 422;
		error.data = errors.array();
		throw error;
	}
	const username = request.body.username;
	const email = request.body.email;
	const password = request.body.password;
	const phone_number = request.body.phone_number;
	const pan_number = request.body.pan_number;
	const avatar = request.body.avatar;

	const hashedPassword = await bcrypt.hash(password, 12);

	const user = new User({
		username: username,
		email: email,
		password: hashedPassword,
		phone_number: phone_number,
		pan_number: pan_number,
		avatar: avatar ? avatar : '',
		cashkicks: [],
	});

	try {
		const savedUser = await user.save();
		response.status(201).json({
			message: 'User created successfully',
			username: savedUser.username,
		});
	} catch (error) {
		response.status(500).json({ message: 'An unexpected error occured!' });
	}
};

const login = async (
	request: express.Request,
	response: express.Response,
	_next: NextFunction
) => {
	const email = request.body.email;
	const password = request.body.password;

	try {
		const user = await User.findOne({ email: email }).exec();
		if (!user) {
			return response.status(401).json({
				message: 'A user with the email not found!',
			});
		}
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			return response.status(401).json({
				message: 'Invalid username or password!',
			});
		}

		const token = jwt.sign(
			{
				email: user.email,
				userId: user._id.toString(),
			},
			JWT_SECRET as string,
			{ expiresIn: '1h' }
		);

		response
			.status(200)
			.json({ message: 'User logged in successfully', token: token });
	} catch (error) {
		response.status(500).json({ message: 'Unexpected error!' });
	}
};

export default { signUp, login };
