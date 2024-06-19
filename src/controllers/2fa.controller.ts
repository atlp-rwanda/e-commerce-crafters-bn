import { Request, Response, NextFunction } from "express";
import User from "../database/models/user";

export const enable2FA = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).token.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isTwoFactorEnabled = !user.isTwoFactorEnabled;
    await user.save();

    const statusMessage = user.isTwoFactorEnabled
      ? "2FA enabled."
      : "2FA disabled.";
    res.status(200).json({ message: statusMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
