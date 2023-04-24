import express, { NextFunction } from 'express';
import { validationResult } from 'express-validator';

import Contract from '../schemas/contract';

const createContract = async (
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

	const {
		name,
		type,
		amount,
		per_payment,
		term_length_fee,
		term_length_months,
	} = request.body;

	const contract = new Contract({
		name: name,
		type: type,
		amount: amount,
		per_payment: per_payment,
		term_length_fee: term_length_fee,
		term_length_months: term_length_months,
	});

	try {
		await contract.save();

		response.status(201).json({
			contract: contract,
		});
	} catch (error: any) {
		next(error);
	}
};

const getAllContracts = async (
	_request: express.Request,
	response: express.Response,
	next: NextFunction
) => {
	try {
		const contracts = await Contract.find().exec();
		response.status(200).json({
			contracts: contracts,
		});
	} catch (error: any) {
		next(error);
	}
};

const getContractById = async (
	request: express.Request,
	response: express.Response,
	next: NextFunction
) => {
	const { contractId } = request.params;

	try {
		const contract = await Contract.findById(contractId).exec();
		if (contract) {
			response.status(200).json({
				contract: contract,
			});
		} else
			response.status(404).json({
				message: 'Contract with given id not found',
			});
	} catch (error: any) {
		next(error);
	}
};

const updateContract = async (
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

	const { contractId } = request.params;

	const {
		name,
		type,
		amount,
		per_payment,
		term_length_fee,
		term_length_months,
	} = request.body;

	try {
		const contract = await Contract.findById(contractId).exec();

		if (contract) {
			contract.name = name;
			contract.type = type;
			contract.amount = amount;
			contract.per_payment = per_payment;
			contract.term_length_fee = term_length_fee;
			contract.term_length_months = term_length_months;

			await contract.save();

			response.status(200).json({
				contract: contract,
			});
		} else {
			response.status(404).json({
				message: 'Contract with given id not found',
			});
		}
	} catch (error: any) {
		next(error);
	}
};

const deleteContract = async (
	request: express.Request,
	response: express.Response,
	next: NextFunction
) => {
	const { contractId } = request.params;

	try {
		await Contract.findByIdAndRemove(contractId).exec();

		response.status(204).json({
			message: 'Contract deleted successfully',
		});
	} catch (error: any) {
		next(error);
	}
};

export default {
	createContract,
	getAllContracts,
	getContractById,
	updateContract,
	deleteContract,
};
