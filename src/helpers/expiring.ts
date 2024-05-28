import Product from "../database/models/product";
import Vendor from "../database/models/vendor";
import User from "../database/models/user";
import { Op } from "sequelize";
import cron from "node-cron";
import nodemailer from "nodemailer";
export const checkExpiringProducts = async () => {
 const productsData = await Product.findAll({
  where: {
   expiringDate: {
    [Op.between]: [
     new Date(),
     new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).getTime(),
    ],
   },
  },
 });
 const jsonProducts = productsData.map((product) => product.toJSON());
 if (jsonProducts.length === 0) return false;
 const organizedProducts = jsonProducts.reduce((acc, product) => {
  const { vendorId } = product;
  if (!acc[vendorId]) {
   acc[vendorId] = [];
  }
  acc[vendorId].push(product.name);
  return acc;
 }, {});
 const vendorsData = await Vendor.findAll({
  where: {
   vendorId: Object.keys(organizedProducts),
  },
 });
 const jsonVendors = vendorsData.map((vendor) => vendor.toJSON());
 const organizedVendors = jsonVendors.reduce((acc, vendor) => {
  const { userId, vendorId } = vendor;
  if (!acc[userId]) {
   acc[userId] = vendorId;
  }
  acc[userId] = vendorId;
  return acc;
 }, {});
 const usersData = await User.findAll({
  where: {
   userId: Object.keys(organizedVendors),
  },
 });
 let send = {};
 const jsonUsers = usersData.map((user) => user.toJSON());
 jsonUsers.forEach((user) => {
  const { email } = user;
  const userIds = Object.keys(organizedVendors);
  userIds.forEach((id) => {
   if (id === user.userId) {
    send[email] = organizedProducts[organizedVendors[id]];
   }
  });
 });
 return send;
};

const sendEmails = async (data) => {
 if (!data) return false;
 const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
   user: process.env.EMAIL,
   pass: process.env.EMAIL_PASS,
  },
 });
 const emails = Object.keys(data);
 emails.map(async (email, i, arr) => {
  const productsList = data[email].reduce((acc, curr) => {
   acc += `<li>${curr}</li>`;
   return acc;
  }, "");
  const mailOptions = {
   from: process.env.EMAIL,
   to: email,
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
               <ul>${productsList}
               </ul>
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
  try {
   await transporter.sendMail(mailOptions);
   arr[i] = "sent";
  } catch (error) {
   console.log(error);
  }
  return arr;
 });
};
cron.schedule("0 0 * * */14", async () => {
 const data = await checkExpiringProducts();
 sendEmails(data);
});
