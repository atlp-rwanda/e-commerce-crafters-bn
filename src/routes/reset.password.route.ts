import express from 'express';
import {  resetPassword } from '../controllers/authController';

const router = express.Router();


router.post('/reset/:token', resetPassword);

export default router;

