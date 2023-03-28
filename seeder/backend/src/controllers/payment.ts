import express, { NextFunction } from 'express';
import Payment from '../schemas/payment';

const createPayment = async (
	request: express.Request,
	response: express.Response,
	_next: NextFunction
) => {
	const status = request.body.status;
	const due_date = request.body.due_date;
	const expected_amount = request.body.expected_amount;
	const outstanding_amount = request.body.outstanding_amount;

	const payment = new Payment({
		status: status,
        due_date: due_date,
        expected_amount: expected_amount,
        outstanding_amount: outstanding_amount,
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
	_request: express.Request,
	response: express.Response,
	_next: NextFunction
) => {
	try {
		const payments = await Payment.find().exec();
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

	try {
		const payment = await Payment.findById(paymentId).exec();
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
	const paymentId = request.params.paymentId;
	const updated_status = request.body.status;
	const updated_due_date = request.body.due_date;
	const updated_expected_amount = request.body.expected_amount;
	const updated_outstanding_amount = request.body.outstanding_amount;

	try {
		const payment = await Payment.findById(paymentId).exec();

		if (payment) {
            payment.status = updated_status;
            payment.due_date = updated_due_date;
            payment.expected_amount = updated_expected_amount;
            payment.outstanding_amount = updated_outstanding_amount;
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
		response.status(500).json({
			message: 'Something went wrong!',
		});
	}
};

const deletePayment = async (request: express.Request,
	response: express.Response,
	_next: NextFunction) => {
        const paymentId = request.params.paymentId;

        await Payment.findByIdAndRemove(paymentId);

        response.status(201).json({
            message: 'Payment deleted successfully',
        })
    }

export default {
	createPayment,
	getAllPayments,
	getPaymentById,
	updatePayment,
    deletePayment,
};
