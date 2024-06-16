import Vendor from "../database/models/vendor"
export const findVendorByUserId = async(userId: any)=>{
    const vendor = await Vendor.findOne({where: {userId: userId}})
    if(!vendor){
        return false
    }
    return vendor
}