import express, { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const { JWT_SECRET } = process.env;

const checkAuthentication = (
	request: express.Request,
	response: express.Response,
	next: NextFunction
) => {
	const authenticationHeader = request.get('Authorization');
	if (!authenticationHeader) {
		return response.status(401).json({
			message: 'Authentication failed',
		});
	}
	const token = authenticationHeader.split(' ')[1];
	let decodedToken;
	try {
		decodedToken = <jwt.UserDetailsJwtPayload>jwt.verify(token, JWT_SECRET as string);
	} catch (error) {
		return response.status(500).json({
			message: 'Unexpected error',
		});
	}

	if (!decodedToken) {
		return response.status(401).json({ message: 'Not authenticated' });
	}

	console.log(decodedToken);

	request.token = decodedToken;
	request.userId = decodedToken.userId;
	next();
};

export default checkAuthentication;
