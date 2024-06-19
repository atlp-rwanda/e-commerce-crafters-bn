import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../helpers/generateToken";
import { loginFunc } from "../services/userService";
import User from "../database/models/user";
import nodemailer from "nodemailer";
import { Request as ExpressRequest } from "express";
import { Session, SessionData } from "express-session";
import {
  comparePassword,
  deleteUserById,
  hashPassword,
  saveUser,
  updateUser,
  updateUserPassword,
} from "../services/userService";
import jwt from "jsonwebtoken";

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

interface ExtendedRequest extends ExpressRequest {
<<<<<<< HEAD
  session: Session &
    Partial<SessionData> & {
      twoFAError?: string;
      email?: string | null;
      password?: string | null;
    };
=======
  session: Session & Partial<SessionData> & { twoFAError?: string, email?: string, password?: string };
>>>>>>> develop
}

export const login = async (req: ExtendedRequest, res: Response) => {
  if (req.session.twoFAError) {
    res.status(401).json({ message: req.session.twoFAError });
  } else {
    try {
      const email = req.session.email || req.body.email;
      const password = req.session.password || req.body.password;

      const existUser = await loginFunc({ email, password });
      if (!existUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        existUser.password
      );
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Invalid credentials. Try again" });
      }

      const token = await generateToken(existUser);
      res.cookie("token", token, { httpOnly: true });
<<<<<<< HEAD

      req.session.email = null;
      req.session.password = null;

=======
>>>>>>> develop
      return res.status(200).json({
        message: "Login successful",
        token,
        user: existUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Unable to log in" });
    }
  }
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  
  const duplicate: any = await User.findOne({ where: { email: email,isVerfied: true } });
  if (duplicate) {
    return res.status(409).json({ Message: "Email already exists" });
  }
  const regenerateToken = await User.findOne({where: {email: email,isVerfied: false}})
  if(regenerateToken){
    await User.destroy({where: {email: email,isVerfied: false}})
  }
  try {
    const hashedPwd = bcrypt.hashSync(password, 10);
    const token = jwt.sign({ email }, "crafters123", { expiresIn: "60s" });
    const insertUser = await User.create({
      name: name,
      email: email,
      password: hashedPwd,
      emailVerificationToken: token,
    });

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
      subject: "Verfiy You Email",
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
                align-items: center;
                justify-content: center
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
                text-align: center
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
            .link{
              padding: 10px 30px;
              background-color: #007bff;
              color: white;
              margin: 0px auto;
              text-decoration: none;

            }
            .verify{
              color: #fff;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Verfiy You Email</h1>
            </div>
            <div class="content">
              <a class="link" href='${process.env.VERFIY_EMAIL_URL}?token=${token}'>
              <span class="verify">Verify Email</span>
              </a>
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
      message: "Email Verfication Sent",
      user: insertUser,
      email: "Email sent to your email address",
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Deleting User
export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    await deleteUserById(userId);
    res.status(200).json({ message: "User deleted successful" });
  } catch (error: any) {
    if (error.message === "user not found") {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
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

export const verifyEmail = async (req: Request, res: Response) => {
  const { token }: { token?: string } = req.query;
  if (!token) {
    return res.status(400).json({ message: "Invalid verification link" });
  }

  try {
    const decoded = jwt.verify(token, "crafters123") as {
      email: string;
    };
    const email = decoded.email;
    const user = await User.findOne({
      where: { emailVerificationToken: token, email: email },
    });
    if (!user) {
      return res.status(404).json({ message: "Invalid token" });
    }
    const userData = await User.findByPk(user.userId);
    if (userData) {
      userData.isVerfied = true;
      userData.emailVerificationToken = "";
      await userData.save();


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
                  <h2>Hello ${userData.name},</h2>
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
      return res.status(200).json({ message: "Email verified successfully" });
    }
    return res.status(404).json({ message: "no user found" });
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Verification link has expired" });
    }
    res.status(500).json({ message: error.message });
  }
};
