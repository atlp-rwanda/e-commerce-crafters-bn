import express from "express"
const route = express.Router()
import { Welcome, login,  } from "../controllers/user.controller";


route.get('/', Welcome)

route.post('/login',login)
export default route;
