import { expect } from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

import { NextFunction } from 'express';

import contractController from '../../controllers/contract';

import * as customTypes from '../../types/express/index';
import Contract from '../../schemas/contract';

dotenv.config({ path: '../../../' });

const { TEST_DATABASE_URI } = process.env;

const contract_details = {
	name: 'Contract 1',
	type: 'Monthly',
	amount: 63380.0,
	per_payment: 6000,
	term_length_fee: 12,
	term_length_months: 12,
};

describe('Contract controller', () => {
	let contract: any;
	const sandbox = sinon.createSandbox();
	before(async () => {
		await mongoose.connect(TEST_DATABASE_URI as string);
		contract = new Contract({ ...contract_details });
		await contract.save();
	});

	it('Check if a contract is created successfully', async () => {
		const request: any = {
			body: { ...contract_details, name: 'Contract 2' },
		};

		const status = sinon.stub();
		const json = sinon.spy();

		const response: any = {
			status,
			json,
		};

		status.returns(response);

		const next: NextFunction = sinon.mock();

		await contractController.createContract(request, response, next);
		expect(status.calledOnce).to.be.true;
		expect(status.args[0][0]).to.equal(201);
		expect(json.args[0][0].contract.name).to.equal('Contract 2');
		expect(json.args[0][0].contract.type).to.equal('Monthly');
	});

	it('Check if all contracts can be obtained', async () => {
		const request: any = {};

		const status = sinon.stub();
		const json = sinon.spy();

		const response: any = {
			status,
			json,
		};

		status.returns(response);

		const next: NextFunction = sinon.mock();

		await contractController.getAllContracts(request, response, next);
		expect(status.args[0][0]).to.equal(200);
		expect(json.args[0][0].contracts).to.have.length(2);
		expect(json.args[0][0].contracts[0].name).to.equal('Contract 1');
		expect(json.args[0][0].contracts[0].type).to.equal('Monthly');
	});

	it('Check if a contract by id is obtained', async () => {
		const request: any = {
			params: {
				contractId: contract._id,
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

		await contractController.getContractById(request, response, next);
		expect(status.calledOnce).to.be.true;
		expect(status.args[0][0]).to.equal(200);
		expect(json.args[0][0].contract.name).to.equal('Contract 1');
		expect(json.args[0][0].contract.type).to.equal('Monthly');
	});

	it('Check if an error message is given if contract with id is not found', async () => {
		const request: any = {
			params: {
				contractId: '642abea6dba09150992f4567',
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

		await contractController.getContractById(request, response, next);
		expect(status.calledOnce).to.be.true;
		expect(status.args[0][0]).to.equal(404);
		expect(json.args[0][0].message).to.equal(
			'Contract with given id not found'
		);
	});

	it('Check if a contract is updated successfully', async () => {
		const request: any = {
            params: {
                contractId: contract._id,
            },
			body: {
				...contract_details,
				term_length_fee: 16,
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

		await contractController.updateContract(request, response, next);
		expect(status.calledOnce).to.be.true;
		expect(status.args[0][0]).to.equal(200);
		expect(json.args[0][0].contract.term_length_fee).to.equal(16);
	});

    it('Check if a contract is deleted successfully', async () => {
		const request: any = {
            params: {
                contractId: contract._id,
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

		await contractController.deleteContract(request, response, next);
		expect(status.calledOnce).to.be.true;
		expect(status.args[0][0]).to.equal(204);
		expect(json.args[0][0].message).to.equal('Contract deleted successfully');
	});

	afterEach(() => {
		sandbox.restore();
	});

	after(async () => {
		await Contract.deleteMany({});
		await mongoose.disconnect();
	});
});
