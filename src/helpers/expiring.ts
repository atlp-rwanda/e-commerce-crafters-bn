import Product from "../database/models/product";
import User from "../database/models/user";
import { Op } from "sequelize";
import nodemailer from "nodemailer";
import models from "../database/models";
import { Response } from "express";
export const checkExpiringProducts = async (req?: Request, res?: Response) => {
 try {
  const expiringProducts = await Product.findAll({
   where: {
    expiringDate: {
     [Op.between]: [
      new Date(),
      new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).getTime(),
     ],
    },
   },
   include: {
    model: models.Vendor,
    as: "Vendor",
   },
  });
  if (expiringProducts.length === 0) {
   return res?.status(204).json({ message: "No Expiring Products" });
  }

  const sendEmails = expiringProducts.map(async (product) => {
   const userId = product.Vendor.userId;
   const userEmail = await User.findByPk(userId);
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
    to: userEmail?.email,
    subject: "Reminder: Expiring Product in Store Inventory⚠️⚠️",
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
                <h1>⚠️Expiring Products⚠️</h1>
            </div>
            <div class="content">
                <h2>Greetings,</h2>
                <p>I hope this email finds you well. I wanted to bring to your attention the upcoming expiration dates of some of the products in your store inventory. As you know, maintaining the freshness and quality of products is crucial for customer satisfaction and business success.</p>
                <p>Upon reviewing our records, it appears that the following items in your inventory are nearing their expiration dates:</p>
               <ul>${product.name}</ul>
                <p>It's essential to take proactive measures to manage these expiring products effectively. Here are a few suggestions:</p>
                <p>Consider offering special promotions or discounts to encourage customers to purchase these items before they expire. This can help minimize losses and increase sales.</p>
                <a href="www.gurisha.com" class="button"><span>Add Discount</span></a>
                <p>Best regards,<br>Crafters</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 crafters. All rights reserved.</p>
                <p><a class='email' href="mailto:${process.env.EMAIL}">${process.env.EMAIL}"</a></p>
            </div>
        </div>
    </body>
    </html>`,
   };
   await transporter.sendMail(mailOptions);
  });
  await Promise.all(sendEmails);
  res?.status(200).json({ message: "Check Expiring Product Successfully" });
 } catch (error: any) {
  return res?.status(500).json({ error: error.message });
 }
};
export const checkExpiredProducts = async (req?: Request, res?: Response) => {
 try {
  const expiredProduct = await Product.findAll({
   where: {
    expiringDate: {
     [Op.lt]: new Date(),
    },
    expired: false,
   },
   include: {
    model: models.Vendor,
    as: "Vendor",
   },
  });
  if (expiredProduct.length === 0) {
   return res?.status(204).json({
    message: "No Expired Products To Update",
   });
  }
  const updatePromise = expiredProduct.map(async (product) => {
   const userId = product.Vendor.userId;
   const userEmail = await User.findByPk(userId);
   product.update({ expired: true, available: false }).then(async () => {
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
     to: userEmail?.email,
     subject: "expireProduct",
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
                                <h1>⚠️Expired Products⚠️</h1>
                            </div>
                            <div class="content">
                            <h2>Greetings,</h2>
                            <p>I hope this email finds you well. I wanted to bring to your attention that some of the products in your store inventory have reached their expiration dates. As you know, maintaining the freshness and quality of products is crucial for customer satisfaction and business success.</p>
                            <p>Upon reviewing our records, it appears that the following items in your inventory have expired and are no longer available for sale:</p>
                            <ul>${product.name}</ul>
                            <p>It's essential to remove these expired products from your shelves to ensure the safety and satisfaction of your customers. Here are a few suggestions:</p>
                            <p>Consider disposing of these items according to your local regulations for expired products. You may also want to review your inventory management practices to prevent future occurrences.</p>
                            <p>Best regards,<br>Crafters</p>
                        </div>
                        
                            <div class="footer">
                                <p>&copy; 2024 crafters. All rights reserved.</p>
                                <p><a class='email' href="mailto:${process.env.EMAIL}">${process.env.EMAIL}"</a></p>
                            </div>
                        </div>
                    </body>
                    </html>`,
    };
    await transporter.sendMail(mailOptions);
   });
  });
  await Promise.all(updatePromise);
  res
   ?.status(200)
   .json({ message: "Check Expired Product Successfully And Sent Emails" });
 } catch (error: any) {
  console.log(error.message);

  return res?.status(500).json({ error: error.message });
 }
};
