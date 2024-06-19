import express from "express";
const route = express.Router();
import { approveVendor, rejectVendor } from "../controllers/roles.controller";
<<<<<<< HEAD
import { VerifyAccessToken } from "../middleware/verfiyToken";
import { verifyAdmin } from "../middleware/verifyRole";
import { deleteReview } from "../controllers/review.controller";

route.put("/approve-vendor/:userId", VerifyAccessToken,verifyAdmin, approveVendor);
route.put("/reject-vendor/:userId", VerifyAccessToken,verifyAdmin, rejectVendor);
route.delete("/delete-review/:id", VerifyAccessToken, verifyAdmin, deleteReview)
=======

route.put("/approve-vendor/:userId", approveVendor);
route.put("/reject-vendor/:userId", rejectVendor);
>>>>>>> develop

export default route;
