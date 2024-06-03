import { Router } from "express";
import { toggle2FAController } from "../controllers/2fa.controller";
import { VerifyAccessToken } from "../middleware/verfiyToken";
import { verifyCodeController } from './../controllers/2fa.controller';
import { login } from "../controllers/user.controller";

const router = Router();

router.post("/enable-2fa", VerifyAccessToken, toggle2FAController);
router.post("/verify-code", verifyCodeController, login);

export default router;