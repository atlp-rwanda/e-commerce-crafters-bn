import jwt from 'jsonwebtoken';
import User from '../database/models/user';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = async (userData: User) => {
    return jwt.sign({
        role: userData.role,
        email: userData.email,
        id: userData.userId,
        password:userData.password
    },  "crafters1234", {
        expiresIn: '1d'
    });
}

export { generateToken };


