import { config } from 'dotenv';
import nodemailer from 'nodemailer';
import Product from '../database/models/product';
import Vendor from '../database/models/vendor';
import User from '../database/models/user';
import { addNotification } from '../controllers/notifications.controller';


export async function sendEmailNotification(product: Product, message: string, scenario: string): Promise<void> {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS,
        },
    });
    const vendor = await Vendor.findOne({ where: { vendorId: product.vendorId }, attributes: ['userId', 'storeName'] })

    if (!vendor) {
        throw new Error('Vendor not found');
    }

    const user = await User.findOne({ where: { userId: vendor.userId }, attributes: ['email', 'name'] })

    if (!user) {
        throw new Error('User not found');
    }

    const data = {
        name: user.name,
        storeName: vendor.storeName,
        email: user.email
    };

    let subject = message;
    let htmlContent = `<p>${message}: ${product.name}</p>`;

    switch (scenario) {
        case 'product_added':
            subject = 'New Product Added';
            htmlContent = `<!DOCTYPE html>
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
                <h1>New Product in ${data.storeName}</h1>
            </div>
            <div class="content">
                <h2>Hello ${data.name},</h2>
                <p>Thank you for adding a product to your store!.</p>
        
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
    </html>`;
            break;
        case 'product_removed':
            subject = 'Product Deleted';
            htmlContent = `<!DOCTYPE html>
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
                background-color: #B9101D;
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
                <h1>Product Deleted in ${data.storeName}</h1>
            </div>
            <div class="content">
                <h2>Hello ${data.name},</h2>
              <p>We have noticed a product has been deleted from your store. </p>
              <p>If it was not you, please contact our team, otherwise neglect this email.</p>
        
                <p>Incase you have any questions or need assistance, feel free to contact our support team.</p>
                <p>Happy shopping!</p>
                <p>Best regards,<br>Crafter</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 crafters. All rights reserved.</p>
                <p><a class='email' href="mailto:${process.env.EMAIL}">${process.env.EMAIL}</a></p>
            </div>
        </div>
    </body>
    </html>`;
            break;
        case 'product_updated':
            subject = 'Product Updated';
            htmlContent = `<!DOCTYPE html>
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
                background-color: #B9101D;
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
                <h1>Product Changes in ${data.storeName}</h1>
            </div>
            <div class="content">
                <h2>Hello ${data.name},</h2>
              <p>We have noticed product details of <b>${product.name}</b> has been changed from your store. </p>
              <p>If it was not you, please contact our team, otherwise neglect this email.</p>
        
                <p>Incase you have any questions or need assistance, feel free to contact our support team.</p>
                <p>Happy shopping!</p>
                <p>Best regards,<br>Crafter</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 crafters. All rights reserved.</p>
                <p><a class='email' href="mailto:${process.env.EMAIL}">${process.env.EMAIL}</a></p>
            </div>
        </div>
    </body>
    </html>`;
        default:
            break;
    }

    const mailOptions = {
        from: process.env.EMAIL,
        to: data.email,
        subject: subject,
        html: htmlContent,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

export async function sendInAppNotification(product: Product, message: string, action: string): Promise<void> {
    const vendor = await Vendor.findOne({ where: { vendorId: product.vendorId }, attributes: ['userId', 'storeName'] });

    if (!vendor) {
        throw new Error('Vendor not found');
    }

    const user = await User.findOne({ where: { userId: vendor.userId }, attributes: ['email', 'name'] });

    if (!user) {
        throw new Error('User not found');
    }

    const notificationMessage = `Notification: ${message} - ${product.name}`;

    await sendEmailNotification(product, message, action);
    await addNotification(product.vendorId, notificationMessage);
}

