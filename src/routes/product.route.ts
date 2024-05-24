
import express from "express"
import { deleteProduct, updateProduct,readProduct, searchProduct, createProduct } from "../controllers/product.controller"
import { VerifyAccessToken } from "../middleware/verfiyToken";
const router = express.Router()




router.post("/create/product/:id", VerifyAccessToken, createProduct);
router.get("/product/:id", readProduct);
router.get("/products/search", searchProduct)
router.put('/updateProduct/:id',VerifyAccessToken, updateProduct);
router.delete('/deleteProduct/:id', VerifyAccessToken, deleteProduct);

export default router;
