"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectVendorRequest = exports.approveVendorRequest = void 0;
const vendor_1 = __importDefault(require("../database/models/vendor"));
const user_1 = __importDefault(require("../database/models/user"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const approveVendorRequest = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield vendor_1.default.findOne({ where: { userId: userId } });
    const user = yield user_1.default.findOne({ where: { userId: userId } });
    if (!vendor) {
        return { message: "Vendor Request Not Found", status: 404 };
    }
    else {
        yield vendor_1.default.update({ status: "approved" }, { where: { userId: userId } });
        yield user_1.default.update({ role: "vendor" }, { where: { userId: userId } });
        const transporter = nodemailer_1.default.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: "Vendor Request Approved",
            html: ` <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Vendor Request Approved</title>
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
                  background-color: #28a745;
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
                  background-color: #28a745;
                  border-radius: 5px;
                  cursor: pointer;
                  text-decoration: none;
              }
              .button span {
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
                  <h1>Vendor Request Approved</h1>
              </div>
              <div class="content">
                  <h2>Hello ${user.name},</h2>
                  <p>We are excited to inform you that your request to become a vendor has been approved!</p>
                  <p>You can now start listing your products and take advantage of our vendor features.</p>
                  <a href="www.gurisha.com" class="button"><span>Get Started</span></a>
                  <p>If you have any questions or need assistance, feel free to contact our support team.</p>
                  <p>Welcome aboard and happy selling!</p>
                  <p>Best regards,<br>Crafter Team</p>
              </div>
              <div class="footer">
                  <p>&copy; 2024 Crafters. All rights reserved.</p>
                  <p><a class='email' href="mailto:${process.env.EMAIL}">${process.env.EMAIL}</a></p>
              </div>
          </div>
      </body>
      </html>`,
        };
        yield transporter.sendMail(mailOptions);
        return { message: "Vendor Request Approved", status: 200 };
    }
});
exports.approveVendorRequest = approveVendorRequest;
const rejectVendorRequest = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield vendor_1.default.findOne({ where: { userId: userId } });
    const user = yield user_1.default.findOne({ where: { userId: userId } });
    if (!vendor) {
        return { message: "Vendor Request Not Found", status: 404 };
    }
    else {
        yield vendor_1.default.update({ status: "rejected" }, { where: { userId: userId } });
        yield user_1.default.update({ role: "buyer" }, { where: { userId: userId } });
        const transporter = nodemailer_1.default.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: "Vendor Request Rejected",
            html: ` <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Vendor Request Rejected</title>
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
                  background-color: #dc3545;
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
                  background-color: #28a745;
                  border-radius: 5px;
                  cursor: pointer;
                  text-decoration: none;
              }
              .button span {
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
                  <h1>Vendor Request Rejected</h1>
              </div>
              <div class="content">
              <h2>Hello ${user.name},</h2>
              <p>We regret to inform you that your request to become a vendor has been rejected.</p>
              <p>Unfortunately, we are unable to approve your application at this time. Please feel free to reach out to our support team if you have any questions or require further information.</p>
              <p>Thank you for your understanding.</p>
              <p>Best regards,<br>Crafter Team</p>
              </div>
              <div class="footer">
                  <p>&copy; 2024 Crafters. All rights reserved.</p>
                  <p><a class='email' href="mailto:${process.env.EMAIL}">${process.env.EMAIL}</a></p>
              </div>
          </div>
      </body>
      </html>`,
        };
        yield transporter.sendMail(mailOptions);
        return { message: "Vendor Request Rejected", status: 200 };
    }
});
exports.rejectVendorRequest = rejectVendorRequest;
