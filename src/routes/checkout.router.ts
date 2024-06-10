import express from 'express'
import { createOrder } from '../controllers/checkout.controller'
import { VerifyAccessToken } from '../middleware/verfiyToken'

const router = express.Router()
import { VerifyAccessToken } from '../middleware/verfiyToken'

router.post('/checkout', VerifyAccessToken, createOrder)

export default router