import { Request, Response } from "express";
import { saveProduct, getAllProducts, getProductById, searchProducts} from "../services/productService";
import Vendor from "../database/models/vendor";
import Product from "../database/models/product";
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

}

export const readAllProducts = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const products = await getAllProducts(page, limit);
        
        if (products.length === 0) {
            return res.status(404).json({ error: "No products found" });
        }
        
        return res.status(200).json(products);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const readProduct = async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        return res.status(200).json(product);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};


export const viewProducts = async (req: Request, res: Response) => {
  try {
    const tokenData = (req as any).token;
    let existVendor = await Vendor.findByPk(tokenData.vendorId);
    if (existVendor) {

      const products = await Product.findAll({
        where: {vendorId: tokenData.vendorId}
      });

      if (!products.length) {
        res.status(404).json({message: "No products found"});
        return;
      }
      res.status(200).json(products);
    }else {
      return res.status(500).json({error: "No vendor found"});
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
