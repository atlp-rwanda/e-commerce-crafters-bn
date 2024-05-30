import express from 'express'
import { createOrder } from '../controllers/checkout.controller'
const router = express.Router()

router.post('/checkout', createOrder)

export default router