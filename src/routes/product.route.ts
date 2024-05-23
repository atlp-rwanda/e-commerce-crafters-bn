import express from "express";
import { readProduct, searchProduct } from "../controllers/product.controller";

const router = express.Router();

router.get("/product/:id", readProduct);
router.get("/products/search", searchProduct)

export default router;