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
