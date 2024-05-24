
import express from "express"
import { deleteProduct, updateProduct,readProduct, searchProduct, createProduct, readAllProducts } from "../controllers/product.controller"
import { VerifyAccessToken } from "../middleware/verfiyToken";
const router = express.Router()




router.get("/readAllProducts", readAllProducts);
router.get("/readProduct/:id", readProduct);
router.get("/products/search", searchProduct)
router.put('/updateProduct/:id',VerifyAccessToken, updateProduct);
router.delete('/deleteProduct/:id', VerifyAccessToken, deleteProduct);

export default router;
