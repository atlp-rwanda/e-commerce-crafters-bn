import express from "express"
const route = express.Router()
import { registerVendor } from "../controllers/vendor.controller"

route.post('/registerVendor', registerVendor)

export default route