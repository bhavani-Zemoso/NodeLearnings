import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

import contractRoutes from './routes/contract';
import paymentRoutes from './routes/payment';

dotenv.config();

const { DATABASE_URI } = process.env;

const MONGODB_URI = DATABASE_URI as string;

const app = express();

app.use(bodyParser.json());

app.use('/api', contractRoutes);
app.use('/api', paymentRoutes);

mongoose
	.connect(MONGODB_URI)
	.then((result) => {
		console.log('Connected to database');
		app.listen(3000);
	})
	.catch((error) => {
		console.log(error);
	});
