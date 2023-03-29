import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

import contractRoutes from './routes/contract';
import paymentRoutes from './routes/payment';
import authRoutes from './routes/auth';

dotenv.config();

const { DATABASE_URI } = process.env;

const MONGODB_URI = DATABASE_URI as string;

const app = express();

app.use(bodyParser.json());

app.use((_request, response, next) => {
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader(
		'Access-Control-Allow-Methods',
		'OPTIONS, GET, POST, PUT, PATCH, DELETE'
	);
	response.setHeader(
		'Access-Control-Allow-Headers',
		'Content-Type, Authorization'
	);
	next();
});
app.use('/api', contractRoutes);
app.use('/api', paymentRoutes);
app.use('/api', authRoutes);

mongoose
	.connect(MONGODB_URI)
	.then((result) => {
		console.log('Connected to database');
		app.listen(3000);
	})
	.catch((error) => {
		console.log(error);
	});
