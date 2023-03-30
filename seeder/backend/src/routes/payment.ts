import express from 'express';

import { body } from 'express-validator';

import paymentController from '../controllers/payment';
import checkAuthentication from '../middleware/check-auth';

const status = ['Upcoming', 'Pending'];

const router = express.Router();

router.post(
	'/payments',
	[
		body('status', 'Please enter a valid status').notEmpty().isIn(status),
		body('due_date', 'Please enter a valid date').notEmpty().isDate(),
		body('expected_amount', 'Please enter a valid number')
			.notEmpty()
			.isNumeric(),
		body('outstanding_amount', 'Please enter a valid number')
			.notEmpty()
			.isNumeric(),
	],
	checkAuthentication,
	paymentController.createPayment
);

router.get('/payments', checkAuthentication, paymentController.getAllPayments);

router.get(
	'/payment/:paymentId',
	checkAuthentication,
	paymentController.getPaymentById
);

router.put(
	'/payment/:paymentId',
	[
		body('status', 'Please enter a valid status').notEmpty().isIn(status),
		body('due_date', 'Please enter a valid date').notEmpty().isDate(),
		body('expected_amount', 'Please enter a valid number')
			.notEmpty()
			.isNumeric(),
		body('outstanding_amount', 'Please enter a valid number')
			.notEmpty()
			.isNumeric(),
	],
	checkAuthentication,
	paymentController.updatePayment
);

router.delete(
	'/payment/:paymentId',
	checkAuthentication,
	paymentController.deletePayment
);

export default router;
