import express, { NextFunction } from 'express';
import { validationResult } from 'express-validator';

import Payment from '../schemas/payment';

const createPayment = async (
	request: express.Request,
	response: express.Response,
	next: NextFunction
) => {
	const errors = validationResult(request);
	if (!errors.isEmpty()) {
		const error = new Error('Validation failed.');
		error.statusCode = 422;
		error.data = errors.array();
		throw error;
	}

	const userId = request.userId;

	const { status, due_date, expected_amount, outstanding_amount } =
		request.body;

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
		next(error);
	}
};

const getAllPayments = async (
	request: express.Request,
	response: express.Response,
	next: NextFunction
) => {
	const userId = request.userId;
	try {
		const payments = await Payment.find({ user_id: userId }).exec();
		response.status(200).json({
			payments: payments,
		});
	} catch (error: any) {
		next(error);
	}
};

const getPaymentById = async (
	request: express.Request,
	response: express.Response,
	next: NextFunction
) => {
	const { paymentId } = request.params;
	const userId = request.userId;

	try {
		const payment = await Payment.findOne({
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
		next(error);
	}
};

const updatePayment = async (
	request: express.Request,
	response: express.Response,
	next: NextFunction
) => {
	const errors = validationResult(request);
	if (!errors.isEmpty()) {
		const error = new Error('Validation failed.');
		error.statusCode = 422;
		error.data = errors.array();
		throw error;
	}
	const { paymentId } = request.params;
	const userId = request.userId;

	const { status, due_date, expected_amount, outstanding_amount } =
		request.body;

	try {
		const payment = await Payment.findOne({
			_id: paymentId,
			user_id: userId,
		}).exec();

		if (payment) {
			payment.status = status;
			payment.due_date = due_date;
			payment.expected_amount = expected_amount;
			payment.outstanding_amount = outstanding_amount;
			await payment.save();

			response.status(200).json({
				payment: payment,
			});
		} else {
			response.status(404).json({
				message: 'Payment with given id not found',
			});
		}
	} catch (error: any) {
		next(error);
	}
};

const deletePayment = async (
	request: express.Request,
	response: express.Response,
	next: NextFunction
) => {
	const userId = request.userId;
	const { paymentId } = request.params;

	try {
		const payment = await Payment.find({
			_id: paymentId,
			user_id: userId,
		}).exec();
		if (payment) await Payment.deleteOne(payment).exec();
		else response.status(404).json({ message: 'Payment with id not found' });
	} catch (error) {
		next(error);
	}

	response.status(204).json({
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
