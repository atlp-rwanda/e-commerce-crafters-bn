import express from "express";
const route = express.Router();
import { Welcome, deleteUser, editUser, register } from "../controllers/user.controller";


route.get("/", Welcome);
route.post("/register", register);
route.patch("/updateuser/:id", editUser)

route.delete("/deleteuser/:id", deleteUser);

export default route;
