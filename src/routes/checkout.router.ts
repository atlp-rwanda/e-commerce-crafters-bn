import express from 'express'
import { createOrder } from '../controllers/checkout.controller'
import { VerifyAccessToken } from '../middleware/verfiyToken'

const router = express.Router()

router.post('/checkout', VerifyAccessToken, createOrder)

export default router