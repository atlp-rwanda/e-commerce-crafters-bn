import { Request, Response } from 'express';
import User from '../database/models/user';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';


export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if(!email) return res.status(400).json({Message:'password is required!'})
    const user:any = await User.findOne({ where: { email:email} });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expires = Date.now() + 3600000; 

    const username= user.name
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(expires);
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL,
      subject: 'Password Reset',
      text: `You are receiving this because you ${username}have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error:any) {
    res.status(500).json({ message: 'Error requesting password reset',error: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const {password } = req.body;
    if(!password) return res.status(400).json({Message:'password is required!'})
    const user = await User.findOne({
      where: {
        resetPasswordToken: req.params.id,
      },
    });
    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    user.password = await bcrypt.hashSync(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: 'Password has been reset' });
  } catch (error:any) {
    res.status(500).json({ message: 'Error resetting password', error:error.message });
  }
};
