import express from "express";
const route = express.Router();
import { approveVendor, rejectVendor } from "../controllers/roles.controller";
import { VerifyAccessToken } from "../middleware/verfiyToken";

route.put("/approve-vendor/:userId", VerifyAccessToken, approveVendor);
route.put("/reject-vendor/:userId", VerifyAccessToken, rejectVendor);

export default route;
