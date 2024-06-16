import express from 'express';
import { Router } from 'express';
import { requestPasswordReset, resetPassword } from '../controllers/authController';

const router = express.Router();


router.post('/request-reset-password', requestPasswordReset);
router.post('/reset-password/:id', resetPassword);

export default router;

