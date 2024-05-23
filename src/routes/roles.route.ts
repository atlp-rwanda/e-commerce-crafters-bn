import express from "express";
const route = express.Router();
import { approveVendor, rejectVendor } from "../controllers/roles.controller";

route.put("/approve-vendor/:userId", approveVendor);
route.put("/reject-vendor/:userId", rejectVendor);

export default route;
