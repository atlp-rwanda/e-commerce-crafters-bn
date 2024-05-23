import express from "express"
const route = express.Router()
import { deletingVendor, registerVendor } from "../controllers/vendor.controller"

route.post('/registerVendor', registerVendor)
route.delete('/deleteVendor/:id',deletingVendor)

export default route