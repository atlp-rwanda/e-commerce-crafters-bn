import express from "express"
const route = express.Router()
import { Welcome, register } from "../controllers/user.controller";


route.get('/', Welcome)
route.post('/register', register)

export default route
