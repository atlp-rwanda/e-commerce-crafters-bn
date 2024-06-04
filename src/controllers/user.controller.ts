import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../helpers/generateToken";
import { loginFunc } from "../services/userService";
import User from "../database/models/user";
import nodemailer from "nodemailer";
import {
  comparePassword,
  deleteUserById,
  hashPassword,
  saveUser,
  updateUser,
  updateUserPassword,
} from "../services/userService";

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
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      existUser.password
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid credentials. Try again" });
    }

    const token = await generateToken(existUser);
    res.cookie("token", token, { httpOnly: true });
    return res.status(200).json({
      message: "Login successfull",
      token,
      user: existUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to log in" });
  }
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  const duplicate: any = await User.findOne({ where: { email: email } });
  if (duplicate) {
    return res.status(409).json({ Message: "Email already exists" });
  }
  try {
    const senddata = await saveUser(req.body);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Welcome to Our E-commerce Platform",
      html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Our E-commerce Platform</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding: 20px 0;
                background-color: #007bff;
                color: #ffffff;
            }
            .header h1 {
                margin: 0;
            }
            .content {
                padding: 20px;
            }
            .content h2 {
                color: #333333;
            }
            .content p {
                color: #555555;
            }
            .button {
                display: block;
                width: 200px;
                margin: 20px auto;
                padding: 10px;
                text-align: center;
                background-color: #007bff;
                border-radius: 5px;
                cursor: pointer;
                text-decoration: none;
            }
            .button span{
              color: #ffffff;
                text-decoration: none;
            }

            .footer {
                text-align: center;
                padding: 20px;
                background-color: #f4f4f4;
                color: #555555;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome to Our E-commerce Platform</h1>
            </div>
            <div class="content">
                <h2>Hello ${name},</h2>
                <p>Thank you for creating an account with us! We are thrilled to have you on board.</p>
                <p>At Our E-commerce Platform, we offer a wide range of products to suit all your needs. To get started, click the button below to visit our store and explore our latest collections.</p>
                <a href="www.gurisha.com" class="button"><span>Visit our store</span></a>
                <p>If you have any questions or need assistance, feel free to contact our support team.</p>
                <p>Happy shopping!</p>
                <p>Best regards,<br>Crafter</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 crafters. All rights reserved.</p>
                <p><a class='email' href="mailto:${process.env.EMAIL}">${process.env.EMAIL}</a></p>
            </div>
        </div>
    </body>
    </html>`,
    };
    await transporter.sendMail(mailOptions);
    res.status(201).json({
      message: "User created",
      user: senddata,
      email: "Email sent to your email address",
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Deleting User
export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    await deleteUserById(userId);
    res.status(200).json({ message: "User deleted successful" });
  } catch (error: any) {
    res.status(500).json({ error:"Internal error server" });
  }
};

export const editUser = async (req: Request, res: Response) => {
  const { name, email, profile } = req.body;
  const userId = req.params.id;

  try {
    const user: any = await User.findOne({ where: { userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email) {
      const duplicate: any = await User.findOne({ where: { email } });
      if (duplicate && duplicate.userId !== userId) {
        return res.status(403).json({ message: "Email already exists" });
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

    res.status(200).json({ message: "User update success", user: updatedUser });
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
      return res.status(404).json({ message: "User not found" });
    }

    if (!password || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const checkPassword = await comparePassword(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({ message: "Wrong password" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords don't match" });
    }

    const hashedPassword = await hashPassword(newPassword);
    const updatedUser = await updateUserPassword(user, hashedPassword);

    res
      .status(200)
      .json({ message: "Password updated successfully", user: updatedUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
