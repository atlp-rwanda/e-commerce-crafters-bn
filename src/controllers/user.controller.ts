import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { generateToken } from "../helpers/generateToken";
import { loginFunc} from "../services/userService";
import User from "../database/models/user";
import { comparePassword, deleteUserById, hashPassword, saveUser, updateUser, updateUserPassword } from "../services/userService";

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


// Deleting User 
export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    await deleteUserById(userId);
    res.status(200).json({ message: "User deleted successful" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const editUser = async (req: Request, res: Response) => {
  const { name, email, profile } = req.body;
  const userId = req.params.id;

  try {
    const user: any = await User.findOne({ where: { userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email) {
      const duplicate: any = await User.findOne({ where: { email } });
      if (duplicate && duplicate.userId !== userId) {
        return res.status(403).json({ message: 'Email already exists' });
      }
      user.email = email;
    }

    if (name) {
      user.name = name;
    }

    if (profile) {
      user.profile = profile;
    }

    const updatedUser = await updateUser(user);
    res.status(200).json({ message: 'User update success', user: updatedUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  const { password, newPassword, confirmPassword } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findOne({ where: { userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!password || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'Please fill all fields' })
    }

    const checkPassword = await comparePassword(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({ message: 'Wrong password' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords don\'t match' })
    }

    const hashedPassword = await hashPassword(newPassword);
    const updatedUser = await updateUserPassword(user, hashedPassword);

    res.status(200).json({ message: 'Password updated successfully', user: updatedUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
