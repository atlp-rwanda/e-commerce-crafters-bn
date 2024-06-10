import { twoFAController } from './../middleware/2fa.middleware';
import express from "express"
import { Welcome, deleteUser, editUser, login, register, updatePassword } from "../controllers/user.controller";
import { VerifyAccessToken } from "../middleware/verfiyToken";

import { addFeedback, addReview } from "../controllers/review.controller";


const route = express.Router();

route.get("/", Welcome);

route.post("/register", register);
route.patch("/updateuser/:id", editUser)
route.patch("/updatepassword/:id", updatePassword)
route.delete("/deleteuser/:id",VerifyAccessToken,deleteUser);
route.post("/login",twoFAController, login);
route.patch("/updateuser/:id", VerifyAccessToken, editUser)
route.patch("/updatepassword/:id", VerifyAccessToken, updatePassword)
route.delete("/deleteuser/:id", VerifyAccessToken, deleteUser);
route.post("/login", login);
route.post("/addreview/:id", VerifyAccessToken, addReview);

export default route;
