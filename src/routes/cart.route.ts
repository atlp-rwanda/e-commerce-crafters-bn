import { Router } from 'express';
import { addToCart } from '../controllers/cart.controller';

const router = Router();

router.post('/addcart', addToCart);

export default router;
