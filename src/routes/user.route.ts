import express from "express"
const route = express.Router()
import { Welcome  } from "../controllers/user.controller";
import express from "express";
const route = express.Router();
import { Welcome, deleteUser, editUser, register, updatePassword } from "../controllers/user.controller";


route.get("/", Welcome);

route.post("/register", register);
route.patch("/updateuser/:id", editUser)
route.patch("/updatepassword/:id", updatePassword)
route.delete("/deleteuser/:id", deleteUser);

export default route;
