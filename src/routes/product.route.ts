import express from "express"
import { deleteProduct, updateProduct, viewProducts } from "../controllers/product.controller"

const route = express.Router()

route.put('/updateProduct/:id', updateProduct);
route.delete('/deleteProduct/:id', deleteProduct);
route.get('/products', viewProducts)

