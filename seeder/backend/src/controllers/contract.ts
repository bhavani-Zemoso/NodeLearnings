import express, { NextFunction } from 'express';
import Contract from '../schemas/contract';

const createContract = async (
	request: express.Request,
	response: express.Response,
	_next: NextFunction
) => {
	const name = request.body.name;
	const type = request.body.type;
	const amount = request.body.amount;
	const per_payment = request.body.per_payment;
	const term_length_fee = request.body.term_length_fee;
	const term_length_months = request.body.term_length_months;

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
		response.status(500).json({
			message: 'Something went wrong!',
		});
	}
};

const getAllContracts = async (
	_request: express.Request,
	response: express.Response,
	_next: NextFunction
) => {
	try {
		const contracts = await Contract.find().exec();
		response.status(200).json({
			contracts: contracts,
		});
	} catch (error: any) {
		response.status(500).json({
			message: 'Something went wrong!',
		});
	}
};

const getContractById = async (
	request: express.Request,
	response: express.Response,
	_next: NextFunction
) => {
	const contractId = request.params.contractId;

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
		response.status(500).json({
			message: 'Something went wrong!',
		});
	}
};

const updateContract = async (
	request: express.Request,
	response: express.Response,
	_next: NextFunction
) => {
	const contractId = request.params.contractId;
	const updated_name = request.body.name;
	const updated_type = request.body.type;
	const updated_amount = request.body.amount;
	const updated_per_payment = request.body.per_payment;
	const updated_term_length_fee = request.body.term_length_fee;
	const updated_term_length_months = request.body.term_length_months;

	try {
		const contract = await Contract.findById(contractId).exec();

		if (contract) {
			contract.name = updated_name;
			contract.type = updated_type;
			contract.amount = updated_amount;
			contract.per_payment = updated_per_payment;
			contract.term_length_fee = updated_term_length_fee;
			contract.term_length_months = updated_term_length_months;

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
		response.status(500).json({
			message: 'Something went wrong!',
		});
	}
};

const deleteContract = async (
	request: express.Request,
	response: express.Response,
	_next: NextFunction
) => {
	const contractId = request.params.contractId;

	await Contract.findByIdAndRemove(contractId);

	response.status(201).json({
		message: 'Contract deleted successfully',
	});
};

export default {
	createContract,
	getAllContracts,
	getContractById,
	updateContract,
	deleteContract,
};
