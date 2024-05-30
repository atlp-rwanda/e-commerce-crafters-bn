import express from "express"
const route = express.Router()
import { deletingVendor, editVendor, registerVendor } from "../controllers/vendor.controller"
import { viewProducts } from "../controllers/product.controller"
import { VerifyAccessToken } from "../middleware/verfiyToken"

route.post('/requestVendor', registerVendor)
route.delete('/deleteVendor/:id', VerifyAccessToken, deletingVendor)
route.get('/vendorProduct/:id', VerifyAccessToken, viewProducts)
route.patch('/updateVendor/:id', VerifyAccessToken, editVendor)

export default route
