import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcryptjs';

import User from '../../schemas/user';
import authController from '../../controllers/auth';
import { NextFunction } from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
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

describe('Auth Controller - Login', () => {
	let user: any;
	const sandbox = sinon.createSandbox();
	before(async () => {
		await mongoose.connect(TEST_DATABASE_URI as string);
		const hashedPassword = await bcrypt.hash('test@123', 12);
		const newUser = new User({ ...user_details, password: hashedPassword });
		user = await newUser.save();
	});

	it('Check if user logs in successfully', async () => {
		const mockFindOne: any = sandbox.stub(User, 'findOne');
		mockFindOne.returns({
			exec: () => user,
		});

		const request: any = {
			body: {
				email: 'test123@gmail.com',
				password: 'test@123',
			},
		};

		const status = sinon.stub();
		const json = sinon.spy();

		const response: any = {
			status,
			json,
		};

		status.returns(response);

		const next: NextFunction = sinon.mock();

		await authController.login(request, response, next);
		expect(status.calledOnce).to.be.true;
		expect(status.args[0][0]).to.equal(200);
		expect(json.args[0][0].message).to.equal('User logged in successfully');
	});

	it('Check if an error occurs if email is not found', async () => {
		const mockFindOne: any = sandbox.stub(User, 'findOne');
		mockFindOne.returns({
			exec: () => null,
		});

		const request: any = {
			body: {
				email: 'test1234@gmail.com',
				password: 'test@123',
			},
		};

		const status = sinon.stub();
		const json = sinon.spy();

		const response: any = {
			status,
			json,
		};

		status.returns(response);

		const next: NextFunction = sinon.mock();

		await authController.login(request, response, next);
		expect(status.calledOnce).to.be.true;
		expect(status.args[0][0]).to.equal(401);
		expect(json.args[0][0].message).to.equal(
			'A user with the email not found!'
		);
	});

	it('Check if an error occurs if the password does not match', async () => {
		const mockFindOne: any = sandbox.stub(User, 'findOne');
		mockFindOne.returns({
			exec: () => user,
		});

		const request: any = {
			body: {
				email: 'test123@gmail.com',
				password: 'test@12345',
			},
		};

		const status = sinon.stub();
		const json = sinon.spy();

		const response: any = {
			status,
			json,
		};

		status.returns(response);

		const next: NextFunction = sinon.mock();

		await authController.login(request, response, next);
		expect(status.calledOnce).to.be.true;
		expect(status.args[0][0]).to.equal(401);
		expect(json.args[0][0].message).to.equal('Invalid username or password!');
	});

	afterEach(() => {
		sandbox.restore();
	});

	after(async () => {
		await User.deleteMany({});
		await mongoose.disconnect();
	});
});

describe('Auth Controller - Signup', () => {
	let user: any;
	const sandbox = sinon.createSandbox();
	before(async () => {
		await mongoose.connect(TEST_DATABASE_URI as string);
	});

	it('Check if user signs up successfully', async () => {
		const request: any = {
			body: { ...user_details },
		};

		const status = sinon.stub();
		const json = sinon.spy();

		const response: any = {
			status,
			json,
		};

		status.returns(response);

		const next: NextFunction = sinon.mock();

		await authController.signUp(request, response, next);
		expect(status.calledOnce).to.be.true;
		expect(status.args[0][0]).to.equal(201);
		expect(json.args[0][0].message).to.equal('User created successfully');
		expect(json.args[0][0].username).to.equal('test_username');
	});

	afterEach(() => {
		sandbox.restore();
	});

	after(async () => {
		await User.deleteMany({});
		await mongoose.disconnect();
	});
});
