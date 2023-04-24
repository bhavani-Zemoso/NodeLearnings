import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

import User from '../../schemas/user';
import Contract from '../../schemas/contract';
import Cashkick from '../../schemas/cashkick';

import cashkickController from '../../controllers/cashkick';

import { NextFunction } from 'express';

import * as customTypes from '../../types/express/index';

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

const contract1_details = {
	name: 'Contract 1',
	type: 'Monthly',
	amount: 63380.0,
	per_payment: 6000,
	term_length_fee: 12,
	term_length_months: 12,
};

const contract2_details = {
	name: 'Contract 2',
	type: 'Monthly',
	amount: 63380.0,
	per_payment: 6000,
	term_length_fee: 12,
	term_length_months: 12,
};

const cashkick_details = {
	name: 'Cashkick 1',
	status: 'Pending',
	maturity: '2024-03-30',
	total_received: 44800.0,
	total_financed: 40000.0,
};

describe('Cashkick controller', () => {
	let user: any;
	let contract1: any;
	let contract2: any;

	const sandbox = sinon.createSandbox();
	before(async () => {
		await mongoose.connect(TEST_DATABASE_URI as string);
		const hashedPassword = await bcrypt.hash('test@123', 12);
		const newUser = new User({ ...user_details, password: hashedPassword });
		user = await newUser.save();
		contract1 = new Contract({ ...contract1_details });
		await contract1.save();
		contract2 = new Contract({ ...contract2_details });
		await contract2.save();
	});

	it('Check if a cashkick is created successfully', async () => {
		const contracts = [
			{
				contract_id: contract1._id,
				payment_amount: 20000,
			},
			{
				contract_id: contract2._id,
				payment_amount: 20000,
			},
		];
		const request: any = {
			userId: user._id,
			body: { ...cashkick_details, contracts: contracts },
		};

		const status = sinon.stub();
		const json = sinon.spy();

		const response: any = {
			status,
			json,
		};

		status.returns(response);

		const next: NextFunction = sinon.mock();

		await cashkickController.createCashkick(request, response, next);
		expect(status.calledOnce).to.be.true;
		expect(status.args[0][0]).to.equal(201);
		expect(json.args[0][0].cashkick.name).to.equal('Cashkick 1');
	});
	it('Check if all cashkicks can be obtained', async () => {
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

		await cashkickController.getCashkicks(request, response, next);
		expect(status.args[0][0]).to.equal(200);
		expect(json.args[0][0].cashkicks).to.have.length(1);
		expect(json.args[0][0].cashkicks[0].name).to.equal('Cashkick 1');
		expect(json.args[0][0].cashkicks[0].status).to.equal('Pending');
	});

	afterEach(() => {
		sandbox.restore();
	});

	after(async () => {
		await Cashkick.deleteMany({});
		await Contract.deleteMany({});
		await User.deleteMany({});
		await mongoose.disconnect();
	});
});
