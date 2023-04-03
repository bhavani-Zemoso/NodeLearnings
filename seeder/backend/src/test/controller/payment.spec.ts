import { expect } from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

import { NextFunction } from 'express';

import paymentController from '../../controllers/payment';

import * as customTypes from '../../types/express/index';
import Payment from '../../schemas/payment';
import User from '../../schemas/user';

dotenv.config({ path: '../../../' });

const { TEST_DATABASE_URI } = process.env;

const user_details = {
	username: 'test_username',
	email: 'test123@gmail.com',
	password: 'test@123',
	phone_number: '+919878987656',
	pan_number: 'ASCDE3456',
	cashkicks: [],
	avatar: '',
};

const payment_details = {
	status: 'Pending',
	due_date: new Date('2023-04-28'),
	expected_amount: 3733.33,
	outstanding_amount: 41066.67,
};

describe('Payment controller', () => {
	let payment: any;
	let user: any;
	const sandbox = sinon.createSandbox();
	before(async () => {
		await mongoose.connect(TEST_DATABASE_URI as string);
		const hashedPassword = await bcrypt.hash('test@123', 12);
		const newUser = new User({ ...user_details, password: hashedPassword });
		user = await newUser.save();
		payment = new Payment({ ...payment_details, user_id: user._id });
		payment = await payment.save();
	});

	it('Check if a payment is created successfully', async () => {
		const request: any = {
            userId: user._id,
			body: { ...payment_details, status: 'Upcoming', due_date: '2023-03-05' },
			
		};

		const status = sinon.stub();
		const json = sinon.spy();

		const response: any = {
			status,
			json,
		};

		status.returns(response);

		const next: NextFunction = sinon.mock();

		await paymentController.createPayment(request, response, next);
		expect(status.calledOnce).to.be.true;
		expect(status.args[0][0]).to.equal(201);
		expect(json.args[0][0].payment.status).to.equal('Upcoming');
	});

	it('Check if all payments can be obtained', async () => {
		const request: any = {
			userId: user._id,
		};

		const status = sinon.stub();
		const json = sinon.spy();

		const response: any = {
			status,
			json,
		};

		status.returns(response);

		const next: NextFunction = sinon.mock();

		await paymentController.getAllPayments(request, response, next);
		expect(status.args[0][0]).to.equal(200);
		expect(json.args[0][0].payments).to.have.length(2);
		expect(json.args[0][0].payments[1].status).to.equal('Upcoming');
		expect(json.args[0][0].payments[0].expected_amount).to.equal(3733.33);
	});

	it('Check if a payment by id is obtained', async () => {
		const request: any = {
			params: {
				paymentId: payment._id,
			},
			userId: user._id,
		};

		const status = sinon.stub();
		const json = sinon.spy();

		const response: any = {
			status,
			json,
		};

		status.returns(response);

		const next: NextFunction = sinon.mock();

		await paymentController.getPaymentById(request, response, next);
		expect(status.calledOnce).to.be.true;
		expect(status.args[0][0]).to.equal(200);
		expect(json.args[0][0].payment.status).to.equal('Pending');
		expect(json.args[0][0].payment.outstanding_amount).to.equal(41066.67);
	});

	it('Check if an error message is given if payment with id is not found', async () => {
		const request: any = {
			params: {
				paymentId: '642b03a658934f117c6989d5',
			},
			userId: user._id,
		};

		const status = sinon.stub();
		const json = sinon.spy();

		const response: any = {
			status,
			json,
		};

		status.returns(response);

		const next: NextFunction = sinon.mock();

		await paymentController.getPaymentById(request, response, next);
		expect(status.calledOnce).to.be.true;
		expect(status.args[0][0]).to.equal(404);
		expect(json.args[0][0].message).to.equal('Payment with given id not found');
	});

	it('Check if a payment is updated successfully', async () => {
		const request: any = {
			params: {
				paymentId: payment._id,
			},
			body: {
				...payment_details,
				status: 'Pending',
			},
			userId: user._id,
		};

		const status = sinon.stub();
		const json = sinon.spy();

		const response: any = {
			status,
			json,
		};

		status.returns(response);

		const next: NextFunction = sinon.mock();

		await paymentController.updatePayment(request, response, next);
		expect(status.calledOnce).to.be.true;
		expect(status.args[0][0]).to.equal(200);
		expect(json.args[0][0].payment.status).to.equal('Pending');
	});

	it('Check if a payment is deleted successfully', async () => {
		const request: any = {
			params: {
				paymentId: payment._id,
			},
            userId: user._id
		};

		const status = sinon.stub();
		const json = sinon.spy();

		const response: any = {
			status,
			json,
		};

		status.returns(response);

		const next: NextFunction = sinon.mock();

		await paymentController.deletePayment(request, response, next);
		expect(status.calledOnce).to.be.true;
		expect(status.args[0][0]).to.equal(204);
		expect(json.args[0][0].message).to.equal('Payment deleted successfully');
	});

	afterEach(() => {
		sandbox.restore();
	});

	after(async () => {
        await User.deleteMany({});
		await Payment.deleteMany({});
		await mongoose.disconnect();
	});
});
