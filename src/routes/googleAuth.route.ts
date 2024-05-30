import express from "express";

import * as googleAuthController from "../controllers/googleAuth.controller";

const router = express.Router();

router.get("/auth/google", googleAuthController.redirectToGoogle);
router.get("/auth/google/callback", googleAuthController.handleGoogleCallback);

export default router;
