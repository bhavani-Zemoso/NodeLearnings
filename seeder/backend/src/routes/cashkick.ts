import express from 'express';

import { body } from 'express-validator';

import cashkickController from '../controllers/cashkick';
import checkAuthentication from '../middleware/check-auth';
import Contract from '../schemas/contract';

const router = express.Router();

const status = ['Pending', 'Approved'];

router.post(
	'/cashkick',
	[
		body('name', 'Please give a valid name').notEmpty().trim().isString(),
		body('status', 'Please give a valid status').notEmpty().isIn(status),
		body('maturity', 'Please give a valid maturity').isDate().notEmpty(),
		body('total_financed', 'Please enter a valid number')
			.isNumeric()
			.notEmpty(),
		body('total_received', 'Please enter a valid number')
			.isNumeric()
			.notEmpty(),
		body('contracts').custom(async (contracts) => {
			contracts.map(async (value: any) => {
				const contract = await Contract.findById(value.contract_id).exec();
				if (!contract) return Promise.reject('Invalid contract');
			});
		}),
	],
	checkAuthentication,
	cashkickController.createCashkick
);

router.get('/cashkick', checkAuthentication, cashkickController.getCashkicks);

export default router;
