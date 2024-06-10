import { twoFAController } from './../middleware/2fa.middleware';
import express from "express"
import { Welcome, deleteUser, editUser, login, register, updatePassword } from "../controllers/user.controller";
<<<<<<< ft-update-order
import { addReview } from "../controllers/review.controller";
import { VerifyAccessToken } from "../middleware/verfiyToken";
=======
import { addFeedback, addReview } from "../controllers/review.controller";
>>>>>>> friday-demo-31-05

const route = express.Router();

route.get("/", Welcome);

route.post("/register", register);
route.patch("/updateuser/:id", editUser)
route.patch("/updatepassword/:id", updatePassword)
<<<<<<< ft-update-order
route.delete("/deleteuser/:id",VerifyAccessToken,deleteUser);
route.post("/login", login);
=======
route.delete("/deleteuser/:id", deleteUser);
route.post("/login",twoFAController, login);
>>>>>>> friday-demo-31-05
route.post("/addreview/:id", addReview);
route.post("/addfeedback/:id", addFeedback);

export default route;
