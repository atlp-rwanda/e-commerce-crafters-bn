import { Request, Response, NextFunction } from 'express';
import User from '../database/models/user';

export const verifyAdmin = async (req: Request, res: Response, next:NextFunction) => {
    try{
        const tokenData = (req as any).token

       if(tokenData.role !== 'admin'){
        return res.status(401).json({message: 'Unauthorized access'})
       }
       next()
    }
    catch(err){
        res.status(500).json({ message: 'Internal server error', err});

    }
}