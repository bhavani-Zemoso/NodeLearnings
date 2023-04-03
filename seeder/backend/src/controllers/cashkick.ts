import express, { NextFunction } from 'express';
import { validationResult } from 'express-validator';

import Cashkick from '../schemas/cashkick';
import Payment from '../schemas/payment';

const createCashkick = async (
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

	const { name, status, maturity, contracts } = request.body;

	const total_received = parseInt(request.body.total_received);
	const total_financed = parseInt(request.body.total_financed);

	const now = new Date();
	const paymentDate = new Date(now.setMonth(now.getMonth() + 1));

	const payment_expected_amount = total_received / 12;

	const payment_outstanding_amount = total_received - payment_expected_amount;

	const payment = new Payment({
		status: 'Upcoming',
		due_date: paymentDate,
		expected_amount: payment_expected_amount,
		outstanding_amount: payment_outstanding_amount,
		user_id: userId,
	});

	let savedPayment;

	try {
		savedPayment = await payment.save();
	} catch (error: any) {
		error.message = 'Unexpected error on payment.'
		next(error);
	}

	const cashkick = new Cashkick({
		name: name,
		status: status,
		maturity: maturity,
		total_received: total_received,
		total_financed: total_financed,
		contracts: contracts,
		payment_id: savedPayment?._id,
		user_id: userId,
	});

	try {
		await cashkick.save();
	} catch (error: any) {
		error.message = 'Unexpected error on cashkick';
		next(error);
	}

	response.status(201).json({ cashkick: cashkick });
};

const getCashkicks = async (
	request: express.Request,
	response: express.Response,
	next: NextFunction
) => {
	const userId = request.userId;
	let cashkicks;

	try {
		cashkicks = await Cashkick.find({ user_id: userId }).exec();
	} catch (error: any) {
		next(error);
	}

	response.status(200).json({ cashkicks: cashkicks });
};

export default { createCashkick, getCashkicks };
