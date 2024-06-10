import { Request, Response, NextFunction } from 'express';
import User from '../database/models/user';

export const verifyAdmin = async (req: Request, res: Response, next:NextFunction) => {
    try{
        const {userId} = req.body;

        if(!userId){
            return res.status(400).json({message: 'User ID required'})
        }

        const user = await User.findByPk(userId);
        if(!user){
            return res.status(404).json({ message: 'User not found'});

        }

        if(user.role === 'admin'){
            next();
        } else{
            res.status(403).json({ message: 'Not Authorized'})
        }
    
    }
    catch(err){
        res.status(500).json({ message: 'Internal server error', err});

    }
}