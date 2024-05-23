import express from "express";
const route = express.Router();
import { Welcome, deleteUser, register } from "../controllers/user.controller";


route.get("/", Welcome);
route.post("/register", register);

route.delete("/deleteuser/:id", deleteUser);

export default route;
