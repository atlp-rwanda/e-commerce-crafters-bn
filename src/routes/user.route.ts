import { twoFAController } from "./../middleware/2fa.middleware";
import express,{Request,Response} from "express";
import {
 Welcome,
 deleteUser,
 editUser,
 login,
 register,
 updatePassword,
} from "../controllers/user.controller";
import { VerifyAccessToken } from "../middleware/verfiyToken";

import { addFeedback, addReview } from "../controllers/review.controller";
import { checkout, webhook } from "../controllers/Payment";

const route = express.Router();

route.get("/", Welcome);

route.post("/register", register);
route.patch("/updateuser/:id", editUser);
route.patch("/updatepassword/:id", updatePassword);
route.delete("/deleteuser/:id", VerifyAccessToken, deleteUser);
route.post("/login", twoFAController, login);
route.post("/addreview/:id", addReview);
route.post("/addfeedback/:id", addFeedback);


export default route;
