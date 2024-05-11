import User from "../database/models/User"

export const saveUser = async(data:any)=>{
    const {username,email,password} = data
    const insertUser = await User.create({ 
        username: username,
        email: email,
        password: password
    })
    return insertUser


}