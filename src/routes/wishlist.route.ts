import { Router } from "express";
import { addToWishlist } from "../controllers/wishlist.controller";
import { VerifyAccessToken } from "../middleware/verfiyToken";

const router = Router();

router.post("/toWishlist", VerifyAccessToken, addToWishlist);

export default router