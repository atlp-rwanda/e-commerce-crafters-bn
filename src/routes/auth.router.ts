import express from 'express';
import { Router } from 'express';
import { requestPasswordReset, resetPassword } from '../controllers/authController';
import { VerifyAccessToken } from '../middleware/verfiyToken';

const router = express.Router();


router.post('/request-reset-password', VerifyAccessToken, requestPasswordReset);
router.post('/reset-password/:id', VerifyAccessToken, resetPassword);

export default router;

