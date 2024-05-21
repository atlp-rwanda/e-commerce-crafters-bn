import { Request, Response } from "express";
import Vendor from "../database/models/vendor";
import { saveVendor } from "../services/vendorServices";

export const registerVendor = async (req: Request, res: Response) => {
    const {userId, storeName, address, TIN, bankAccount, paymentDetails} = req.body
    if(!storeName || !address || !TIN || !bankAccount || !paymentDetails){
        return res.status(400).json({message: "Please fill all the fields"})
    }
    try {
        const result = await saveVendor(req.body)
        return res.status(200).json({message: "Vendor registered successfully", result})
    } catch (error: any) {
        return res.status(500).json({message: error.message})
    }
}