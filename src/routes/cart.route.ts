import { Router } from "express";
import { addToCart, clearCart, deleteProductFromCart, getCart, updateCart } from "../controllers/cart.controller";
import { VerifyAccessToken } from "../middleware/verfiyToken";

const router = Router();

router.post("/addcart", VerifyAccessToken, addToCart);
router.post("/updatecart", VerifyAccessToken, updateCart);
router.get('/getcart/:userId', VerifyAccessToken, getCart);
router.delete('/clearcart/:userId', VerifyAccessToken, clearCart);
router.delete('/cart/:userId/product/:productId', VerifyAccessToken, deleteProductFromCart);

export default router;
