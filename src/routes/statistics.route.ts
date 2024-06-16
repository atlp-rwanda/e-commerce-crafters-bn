import express from "express";

import { getStatistics } from "../controllers/statisticsController";
import { VerifyAccessToken } from "../middleware/verfiyToken";
const route = express.Router();

route.post("/statistics/:vendorId", VerifyAccessToken, getStatistics);

export default route;
