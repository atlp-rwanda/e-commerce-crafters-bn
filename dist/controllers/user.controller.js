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
exports.updatePassword = exports.editUser = exports.deleteUser = exports.register = exports.login = exports.Welcome = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken_1 = require("../helpers/generateToken");
const userService_1 = require("../services/userService");
const user_1 = __importDefault(require("../database/models/user"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const userService_2 = require("../services/userService");
const Welcome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res
            .status(200)
            .send("<h1 style='text-align:center;font-family: sans-serif'>Welcome to our backend as code crafters team </h1>");
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.Welcome = Welcome;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.twoFAError) {
        res.status(401).json({ message: req.session.twoFAError });
    }
    else {
        try {
            const email = req.session.email || req.body.email;
            const password = req.session.password || req.body.password;
            const existUser = yield (0, userService_1.loginFunc)({ email, password });
            if (!existUser) {
                return res.status(404).json({ message: "User not found" });
            }
            const isPasswordValid = yield bcrypt_1.default.compare(password, existUser.password);
            if (!isPasswordValid) {
                return res
                    .status(401)
                    .json({ message: "Invalid credentials. Try again" });
            }
            const token = yield (0, generateToken_1.generateToken)(existUser);
            res.cookie("token", token, { httpOnly: true });
            return res.status(200).json({
                message: "Login successful",
                token,
                user: existUser,
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Unable to log in" });
        }
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please fill all fields" });
    }
    const duplicate = yield user_1.default.findOne({ where: { email: email } });
    if (duplicate) {
        return res.status(409).json({ Message: "Email already exists" });
    }
    try {
        const hashedPwd = bcrypt_1.default.hashSync(password, 10);
        const insertUser = yield user_1.default.create({
            name: name,
            email: email,
            password: hashedPwd
        });
        const transporter = nodemailer_1.default.createTransport({
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
        yield transporter.sendMail(mailOptions);
        res.status(201).json({
            message: "User created",
            user: insertUser,
            email: "Email sent to your email address",
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.register = register;
// Deleting User
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        yield (0, userService_2.deleteUserById)(userId);
        res.status(200).json({ message: "User deleted successful" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal error server" });
    }
});
exports.deleteUser = deleteUser;
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, profile } = req.body;
    const userId = req.params.id;
    try {
        const user = yield user_1.default.findOne({ where: { userId } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (email) {
            const duplicate = yield user_1.default.findOne({ where: { email } });
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
        const updatedUser = yield (0, userService_2.updateUser)(user);
        res.status(200).json({ message: "User update success", user: updatedUser });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.editUser = editUser;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, newPassword, confirmPassword } = req.body;
    const userId = req.params.id;
    try {
        const user = yield user_1.default.findOne({ where: { userId } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!password || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "Please fill all fields" });
        }
        const checkPassword = yield (0, userService_2.comparePassword)(password, user.password);
        if (!checkPassword) {
            return res.status(400).json({ message: "Wrong password" });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords don't match" });
        }
        const hashedPassword = yield (0, userService_2.hashPassword)(newPassword);
        const updatedUser = yield (0, userService_2.updateUserPassword)(user, hashedPassword);
        res
            .status(200)
            .json({ message: "Password updated successfully", user: updatedUser });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updatePassword = updatePassword;
