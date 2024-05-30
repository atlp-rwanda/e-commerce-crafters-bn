import { Router } from "express";
import { addToCart, updateCart } from "../controllers/cart.controller";

const router = Router();

router.post("/addcart", addToCart);
router.post("/updatecart", updateCart);
export default router;
