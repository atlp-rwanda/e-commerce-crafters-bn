import { Router } from "express";
import { deleteSubscription, saveSubscription } from "../controllers/subscription.controller";

const router = Router();

router.post("/save-subscription", saveSubscription);
router.delete("/unsubscribe", deleteSubscription )

export default router;
