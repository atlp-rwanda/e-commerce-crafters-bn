import { Request, Response } from "express";
import User from "../database/models/user";
import { saveUser } from "../services/userService";
import nodemailer from 'nodemailer'

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

export const register = async (req: Request, res: Response) => {

  const {name, email, password} = req.body
  if(!name || !email || !password) {
  return res.status(400).json({message: 'Please fill all fields'})
  }
  const duplicate: any = await User.findOne({where: {email: email}})
  if(duplicate){
    res.status(409).json({Message: 'Email already exists'})
  }
  try {
    const senddata = await saveUser(req.body);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS
      }
  });

let mailOptions = {
    from: process.env.EMAIL, 
    to: email,
    subject: 'Welcome to Our E-commerce Platform',
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
    </html>`
};
    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: "User created", user: senddata, email: "Email sent to your email address" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
