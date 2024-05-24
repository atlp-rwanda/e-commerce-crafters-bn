import express from "express";
import { readAllProducts, readProduct, searchProduct } from "../controllers/product.controller";

const router = express.Router();

router.get("/readAllProducts", readAllProducts);
router.get("/readProduct/:id", readProduct);
router.get("/products/search", searchProduct)

export default router;