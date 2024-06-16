import express,{Request,Response} from 'express'
import { createOrder } from '../controllers/checkout.controller'
import { checkout, webhook } from '../controllers/Payment';
const router = express.Router()

router.post('/checkout', createOrder)
router.post("/payment/:id", checkout);

router.post('/webhook', express.raw({ type: 'application/json' }), webhook);

router.get("/success", async(req:Request,res:Response)=>{
    res.send("Succesfully")
});
router.get("/cancel", async(req:Request,res:Response)=>{
    res.send("Cancel")
});


export default router