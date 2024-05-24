import User from "../database/models/user";
import bcrypt from 'bcrypt'
export const saveUser = async (data: any) => {
  const { name, email, password } = data;
  const hashedPwd = bcrypt.hashSync(password, 10)
  const insertUser = await User.create({
    name: name,
    email: email,
    password: hashedPwd,
  });
  return insertUser;
};



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

export const deleteUserById = async (userId: any) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("user not found");
  }
  await user.destroy();
};

export const updateUser = async (user: any) => {
  try {
    await user.save();
    return user;
  } catch (error) {
    throw new Error('Error updating user');
  }
}

export const comparePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const hashPassword = async (password: string) => {
  return bcrypt.hashSync(password, 10)
};

export const updateUserPassword = async (user: any, hashedPassword: string) => {
  user.password = hashedPassword;
  await user.save();
  return user;
};
