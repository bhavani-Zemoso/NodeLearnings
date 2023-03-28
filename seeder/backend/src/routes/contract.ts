import express from 'express';

import contractController from '../controllers/contract';

const router = express.Router();

router.post('/contracts', contractController.createContract);

router.get('/contracts', contractController.getAllContracts);

router.get('/contract/:contractId', contractController.getContractById);

router.put('/contract/:contractId', contractController.updateContract);

router.delete('/contract/:contractId', contractController.deleteContract);

export default router;