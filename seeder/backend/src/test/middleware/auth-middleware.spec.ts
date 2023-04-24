import { expect } from 'chai';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

import { NextFunction } from 'express';

import checkAuthentication from '../../middleware/check-auth';

dotenv.config({ path: '../../../' });

const { TEST_BEARER_TOKEN } = process.env;

describe('Authentication middleware', () => {
	const sandbox = sinon.createSandbox();

	it('Check if the middleware throws an error if no authorization header is present', () => {
		const request: any = {
			get: function (headerName: any) {
				return null;
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

		checkAuthentication(request, response, next);
		expect(status.calledOnce).to.be.true;
		expect(status.args[0][0]).to.equal(401);
		expect(json.args[0][0].message).to.equal('Authentication failed');
	});

	it('Check if the middleware throws an error is authorization header is only one string', () => {
		const request: any = {
			get: function (headerName: any) {
				return 'dummy';
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

		checkAuthentication(request, response, next);
		expect(status.calledOnce).to.be.true;
		expect(status.args[0][0]).to.equal(500);
		expect(json.args[0][0].message).to.equal('Unexpected error');
	});

	it('Check if a userId is returned after decoding the token', () => {
		const obj: any = { userId: 'abc' };
		const request: any = {
			get: function (headerName: any) {
				return `Bearer ${TEST_BEARER_TOKEN}`;
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

		const mockJWT = sandbox.stub(jwt, 'verify').returns(obj);

		checkAuthentication(request, response, next);

		expect(request).to.have.property('userId');
		expect(request).to.have.property('userId', 'abc');
		expect(mockJWT.calledOnce).to.be.true;
		
	});

	afterEach(() => {
		sandbox.restore();
	})
});
