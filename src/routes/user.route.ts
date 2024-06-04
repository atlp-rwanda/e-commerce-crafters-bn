import express from "express"
import { Welcome, deleteUser, editUser, login, register, updatePassword } from "../controllers/user.controller";
import { addReview } from "../controllers/review.controller";
import { VerifyAccessToken } from "../middleware/verfiyToken";

const route = express.Router();

route.get("/", Welcome);

route.post("/register", register);
route.patch("/updateuser/:id", VerifyAccessToken, editUser)
route.patch("/updatepassword/:id", VerifyAccessToken, updatePassword)
route.delete("/deleteuser/:id", VerifyAccessToken, deleteUser);
route.post("/login", login);
route.post("/addreview/:id", addReview);

export default route;
