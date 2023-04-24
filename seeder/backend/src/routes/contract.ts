import express from 'express';

import { body } from 'express-validator';

import contractController from '../controllers/contract';
import checkAuthentication from '../middleware/check-auth';

const router = express.Router();

const type = ['Monthly', 'Yearly'];

router.post(
	'/contracts',
	[
		body('name', 'Please enter a valid name').notEmpty().isString(),
		body('type', 'Please enter a valid type').notEmpty().isIn(type),
		body('amount', 'Please enter a valid number').notEmpty().isNumeric(),
		body('per_payment', 'Please enter a valid number').notEmpty().isNumeric(),
		body('term_length_fee', 'Please enter a valid number')
			.notEmpty()
			.isNumeric(),
		body('term_length_months', 'Please enter a valid number')
			.notEmpty()
			.isNumeric(),
	],
	checkAuthentication,
	contractController.createContract
);

router.get(
	'/contracts',
	checkAuthentication,
	contractController.getAllContracts
);

router.get(
	'/contract/:contractId',
	checkAuthentication,
	contractController.getContractById
);

router.put(
	'/contract/:contractId',
	[
		body('name', 'Please enter a valid name').notEmpty().isString(),
		body('type', 'Please enter a valid type').notEmpty().isIn(type),
		body('amount', 'Please enter a valid number').notEmpty().isNumeric(),
		body('per_payment', 'Please enter a valid number').notEmpty().isNumeric(),
		body('term_length_fee', 'Please enter a valid number')
			.notEmpty()
			.isNumeric(),
		body('term_length_months', 'Please enter a valid number')
			.notEmpty()
			.isNumeric(),
	],
	checkAuthentication,
	contractController.updateContract
);

router.delete(
	'/contract/:contractId',
	checkAuthentication,
	contractController.deleteContract
);

export default router;
