import express from 'express';

import contractController from '../controllers/contract';
import checkAuthentication from '../middleware/check-auth';

const router = express.Router();

router.post(
	'/contracts',
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
	checkAuthentication,
	contractController.updateContract
);

router.delete(
	'/contract/:contractId',
	checkAuthentication,
	contractController.deleteContract
);

export default router;
