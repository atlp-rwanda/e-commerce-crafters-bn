import Vendor from "../database/models/vendor";

export const saveVendor = async (data: any) => {
    const {userId, storeName, address, TIN, bankAccount, paymentDetails} = data

    const insertVendor = await Vendor.create({
        userId: userId,
        storeName: storeName,
        address: address,
        TIN: TIN,
        bankAccount: bankAccount,
        paymentDetails
    })

    return insertVendor;
}