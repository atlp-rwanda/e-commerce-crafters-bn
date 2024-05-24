import { Request, Response } from "express";
import { saveProduct, getProductById, searchProducts} from "../services/productService";
import Product from "../database/models/product";
import { checkVendorModifyPermission, checkVendorPermission } from "../services/PermisionService";


export const createProduct = async(req:Request,res:Response)=>{
    try {
        const tokenData = (req as any).token
        const vendorId: string = req.params.id 
        const permissionCheck:any =  await checkVendorPermission(tokenData,vendorId)
        if(!permissionCheck.allowed){
          return res.status(permissionCheck.status).json({message:permissionCheck.message})
        }
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
                vendorId: vendorId,
                expiringDate
            }
            const save = await saveProduct(data) 
            if(!save){
                return res.status(500).json({error: "Failed to save data"})
            }
            return res.status(201).json({message: "Product Created", data: save})
        
      



        
    } catch (error:any) {
        res.status(500).json({error:error.message})
        
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

export const searchProduct = async (req: Request, res: Response) => {
  try {
      const { name, category } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const criteria: any = {};
      if (name) criteria.name = name;
      if (category) criteria.category = category;

      const products = await searchProducts(criteria, page, limit);
      
      if (products.length === 0) {
          return res.status(404).json({ error: "No products found" });
      }
      
      return res.status(200).json(products);
  } catch (error: any) {
      return res.status(500).json({ error: error.message });
  }
};

// update product

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const tokenData = (req as any).token;
    const {vendorId} = req.body
    const  productId  = req.params.id;

    const permissionCheck:any =  await checkVendorModifyPermission(tokenData,vendorId)
    if(!permissionCheck.allowed){
      return res.status(permissionCheck.status).json({message:permissionCheck.message})
    }
 
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

  } catch (error: any) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// delete product

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const tokenData = (req as any).token;
    const  productId  = req.params.id;
    const  {vendorId}  = req.body;
    
    const permissionCheck:any =  await checkVendorModifyPermission(tokenData,vendorId)
    if(!permissionCheck.allowed){
      return res.status(permissionCheck.status).json({message:permissionCheck.message})
    }
 
      const product = await Product.findByPk(productId);

      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      await product.destroy();
      res.status(200).json({ message: "Product deleted successfully" });
 
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};
