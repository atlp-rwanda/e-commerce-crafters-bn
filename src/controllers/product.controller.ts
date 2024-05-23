import { Request, Response } from "express";
import { saveProduct, getProductById, searchProducts} from "../services/productService";
import Vendor from "../database/models/vendor";
import Product from "../database/models/product";


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

};

// update product

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const tokenData = (req as any).token;
    const existVendor = await Vendor.findByPk(tokenData.vendorId);

    if (existVendor) {
      const { productId } = req.params;
      const updateData = req.body;

      const product = await Product.findByPk(productId);
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      await product.update(updateData);
      res
        .status(200)
        .json({ message: "Product updated successfully", product });
    } else{
        return res.status(500).json({ error: "No vendor found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// delete product

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const tokenData = (req as any).token;
    let existVendor = await Vendor.findByPk(tokenData.vendorId);
    if (existVendor) {
      const { productId } = req.params;

      const product = await Product.findByPk(productId);

      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      await product.destroy();
      res.status(200).json({ message: "Product deleted successfully" });
    } else {
        return res.status(500).json({ error: "No vendor found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
