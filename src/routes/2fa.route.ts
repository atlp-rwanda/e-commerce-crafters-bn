import { Router } from "express";
import { enable2FA } from "../controllers/2fa.controller";
import { VerifyAccessToken } from "../middleware/verfiyToken";
import { verifyCode } from "./../middleware/2fa.middleware";
import { login } from "../controllers/user.controller";

const router = Router();

router.post("/enable-2fa", VerifyAccessToken, enable2FA);
router.post("/verify-code", verifyCode, login);

export default router;
