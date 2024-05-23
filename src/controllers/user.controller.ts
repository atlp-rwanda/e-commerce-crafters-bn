import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { generateToken } from "../helpers/generateToken";
import { loginFunc} from "../services/userService";
import User from "../database/models/user";
export const Welcome = async (req: Request, res: Response) => {
  try {
    res
      .status(200)
      .send(
        "<h1 style='text-align:center;font-family: sans-serif'>Welcome to our backend as code crafters team </h1>"
      );
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const existUser = await loginFunc(req.body);
    if (!existUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, existUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials. Try again' });
    }

    const token = await generateToken(existUser);
    res.cookie('token',token,{httpOnly:true})
    return res.status(200).json({
      message: "Login successfull",
      token,
      user: existUser
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to log in' });
  }
};






