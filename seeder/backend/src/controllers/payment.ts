import express, { NextFunction } from 'express';
import { validationResult } from 'express-validator';

import Payment from '../schemas/payment';

const createPayment = async (
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

	const userId = request.userId;

	const status = request.body.status;
	const due_date = request.body.due_date;
	const expected_amount = request.body.expected_amount;
	const outstanding_amount = request.body.outstanding_amount;

	const payment = new Payment({
		status: status,
		due_date: due_date,
		expected_amount: expected_amount,
		outstanding_amount: outstanding_amount,
		user_id: userId,
	});

	try {
		await payment.save();

		response.status(201).json({
			payment: payment,
		});
	} catch (error: any) {
		response.status(500).json({
			message: 'Something went wrong!',
		});
	}
};

const getAllPayments = async (
	request: express.Request,
	response: express.Response,
	_next: NextFunction
) => {
	const userId = request.userId;
	try {
		const payments = await Payment.find({ user_id: userId }).exec();
		response.status(200).json({
			payments: payments,
		});
	} catch (error: any) {
		response.status(500).json({
			message: 'Something went wrong!',
		});
	}
};

const getPaymentById = async (
	request: express.Request,
	response: express.Response,
	_next: NextFunction
) => {
	const paymentId = request.params.paymentId;
	const userId = request.userId;

	try {
		const payment = await Payment.find({
			user_id: userId,
			_id: paymentId,
		}).exec();
		if (payment) {
			response.status(200).json({
				payment: payment,
			});
		} else
			response.status(404).json({
				message: 'Payment with given id not found',
			});
	} catch (error: any) {
		response.status(500).json({
			message: 'Something went wrong!',
		});
	}
};

const updatePayment = async (
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
	const paymentId = request.params.paymentId;
	const userId = request.userId;

	const updated_status = request.body.status;
	const updated_due_date = request.body.due_date;
	const updated_expected_amount = request.body.expected_amount;
	const updated_outstanding_amount = request.body.outstanding_amount;

	try {
		const payment = await Payment.find({
			_id: paymentId,
			user_id: userId,
		}).exec();

		if (payment) {
			payment[0].status = updated_status;
			payment[0].due_date = updated_due_date;
			payment[0].expected_amount = updated_expected_amount;
			payment[0].outstanding_amount = updated_outstanding_amount;
			await payment[0].save();

			response.status(200).json({
				payment: payment,
			});
		} else {
			response.status(404).json({
				message: 'Payment with given id not found',
			});
		}
	} catch (error: any) {
		response.status(500).json({
			message: 'Something went wrong!',
		});
	}
};

const deletePayment = async (
	request: express.Request,
	response: express.Response,
	_next: NextFunction
) => {
	const userId = request.userId;
	const paymentId = request.params.paymentId;

	try {
		const payment = await Payment.find({
			_id: paymentId,
			user_id: userId,
		}).exec();
		if (payment) await Payment.deleteOne(payment).exec();
		else response.status(404).json({ message: 'Payment with id not found' });
	} catch (error) {
		response.status(500).json({ message: 'Unexpected error!' });
	}

	response.status(201).json({
		message: 'Payment deleted successfully',
	});
};

export default {
	createPayment,
	getAllPayments,
	getPaymentById,
	updatePayment,
	deletePayment,
};
