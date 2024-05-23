import User from '../database/models/user';
import bcrypt from 'bcrypt';

export const loginFunc = async (userData: { email: string; password: string }) => {
  const { email} = userData;
  try {
    const existUser = await User.findOne({ where: { email } });
    console.log(existUser)
    return existUser; 
  } catch (error) {

    throw new Error('Unable to log in, may be user not found');
  }
};





