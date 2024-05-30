import User from "../database/models/user";

export async function findUserByEmail(email: string) {
  const user = await User.findOne({ where: { email } });
  return user;
}
