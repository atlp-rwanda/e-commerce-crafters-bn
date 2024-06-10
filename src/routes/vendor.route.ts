import express from "express"
const route = express.Router()
import { deletingVendor, editVendor, registerVendor } from "../controllers/vendor.controller"
import { viewProducts } from "../controllers/product.controller"
<<<<<<< ft-update-order
import { selectReview } from "../controllers/review.controller"
import { VerifyAccessToken } from "../middleware/verfiyToken"
=======
import { selectFeedback, selectReview } from "../controllers/review.controller"
>>>>>>> friday-demo-31-05

route.post('/requestVendor', registerVendor)
route.delete('/deleteVendor/:id',VerifyAccessToken,deletingVendor)
route.get('/vendorProduct/:id', viewProducts)
route.patch('/updateVendor/:id', editVendor)
route.get('/select-review/:id', selectReview)
route.get('/select-feedback/:id', selectFeedback)

export default route
