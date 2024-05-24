import express from 'express';
import { Router } from 'express';
import { requestPasswordReset, resetPassword } from '../controllers/authController';

const router = express.Router();


router.post('/forget-password', requestPasswordReset);

export default router;

