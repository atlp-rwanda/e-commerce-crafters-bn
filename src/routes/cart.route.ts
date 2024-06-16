import { Router } from "express";
import { addToCart, clearCart, deleteProductFromCart, getCart, updateCart } from "../controllers/cart.controller";

const router = Router();

router.post("/addcart", addToCart);
router.post("/updatecart", updateCart);
router.get('/getcart/:userId', getCart);
router.delete('/clearcart/:userId', clearCart);
router.delete('/cart/:userId/product/:productId', deleteProductFromCart);
export default router;
