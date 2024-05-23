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

export const deleteUserById = async (userId: any) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("user not found");
  }
  await user.destroy();
};

export const updateUser = async (user: any) => {
  try {
    await user.update();
    return user;
  } catch (error) {
    throw new Error('Error updating user');
  }  
}
