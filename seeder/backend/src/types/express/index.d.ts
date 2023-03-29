import { ValidationError } from 'express-validator';
import express from '.';
import jwt from 'jsonwebtoken'

declare global {
	namespace Express {
		interface Request {
			user: Record<string, any>;
			userId: string;
			token: string | jwt.JwtPayload;
		}
	}
	interface Error {
		statusCode?: number;
		data?: ValidationError[];
	}
}