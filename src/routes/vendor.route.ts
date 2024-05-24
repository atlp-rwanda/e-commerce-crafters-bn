import express from "express"
const route = express.Router()

import { deletingVendor, registerVendor } from "../controllers/vendor.controller"
import { viewProducts } from "../controllers/product.controller"

route.post('/registerVendor', registerVendor)
route.delete('/deleteVendor/:id',deletingVendor)
route.get('/vendorProduct/:id',viewProducts)


export default route