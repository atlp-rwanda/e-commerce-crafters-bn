import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

export const VerifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
    const bearerToken: string | undefined = req.header('authorization');

    if (!bearerToken) {
        return res.status(401).json({ message: "No token found" });
    }

    const token = bearerToken.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "No token found" });
    }

    jwt.verify(token, 'crafters1234', (err: any, decoded: any) => {
        if (err) {
            if (err instanceof TokenExpiredError) {
                return res.status(401).json({ message: "Expired token" });
            } else if (err instanceof JsonWebTokenError) {
                return res.status(401).json({ message: "Invalid token" });
            } else {
                return res.status(500).json({ message: "Error verifying token" });
            }
        } else {
            (req as any).token= decoded;
         next();
        }
    });
};

