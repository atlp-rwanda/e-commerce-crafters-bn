import { Router } from "express";
import { addToWishlist } from "../controllers/wishlist.controller";

const router = Router();

router.post("/toWishlist", addToWishlist);

export default router