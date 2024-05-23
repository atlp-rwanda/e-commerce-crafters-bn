
import { Request, Response } from "express";
import { saveProduct } from "../services/productService";
import Vendor from "../database/models/vendor";

export const createProduct = async(req:Request,res:Response)=>{
    try {
        const tokenData = (req as any).token
        let existVendor = await Vendor.findByPk(tokenData.vendorId)
        if(existVendor){

            const {name,image,description,discount,price,quantity,category,expiringDate} = req.body
            if(!name || !image || !description || !price || !quantity || !category){
                return res.status(200).json("All Field are required")
            }
            const data = {
                name,
                image,
                description,
                discount: discount ? discount : 0,
                price,
                quantity,
                category,
                vendorId: tokenData.id,
                expiringDate
            }
            const save = await saveProduct(data) 
            if(!save){
                return res.status(500).json({error: "Failed to save data"})
            }
            return res.status(201).json({message: "Product Created"})
        } 
        else{
            return res.status(500).json({error: "No vendor found"})
        }



        
    } catch (error:any) {
        res.status(500).json({error:error.message})
        
    }

}