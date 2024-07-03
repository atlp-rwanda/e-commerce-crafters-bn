import { Router } from "express";
import { addToWishlist, fetchWishlist, removeFromWishlist } from "../controllers/wishlist.controller";

const router = Router();

router.post("/toWishlist", addToWishlist);
router.get("/toWishlist/:userId", fetchWishlist);
router.delete('/toWishlist', removeFromWishlist)

export default router