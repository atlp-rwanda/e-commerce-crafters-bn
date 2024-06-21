import express from "express";
const route = express.Router();
import { approveVendor, rejectVendor } from "../controllers/roles.controller";
import { VerifyAccessToken } from "../middleware/verfiyToken";
import { verifyAdmin } from "../middleware/verifyRole";
import { deleteReview } from "../controllers/review.controller";

route.put("/approve-vendor/:userId", VerifyAccessToken,verifyAdmin, approveVendor);
route.put("/reject-vendor/:userId", VerifyAccessToken,verifyAdmin, rejectVendor);
route.delete("/delete-review/:id", VerifyAccessToken, verifyAdmin, deleteReview)

export default route;
