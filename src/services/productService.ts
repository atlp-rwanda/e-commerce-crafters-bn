import Product from "../database/models/product"
import { Op } from 'sequelize';

export const saveProduct = async (data:any)=>{
    const response = await Product.create(data)
    if(response){
        return response
    }else{
        return false
    }
}

export const getAllProducts = async (page: number, limit: number) => {
    try {
        const offset = (page - 1) * limit;
        const products = await Product.findAll();
        return products;
    } catch (error) {
        throw new Error('Error while fetching all products');
    }
};

export const getProductById = async (productId: string) => {
    try {
        const product = await Product.findByPk(productId);
        return product;
    } catch (error) {
        throw new Error('Error while fetching product');
    }
};

export const searchProducts = async (criteria: any, page: number, limit: number) => {
    try {
      const offset = (page - 1) * limit;
  
      const products = await Product.findAll({
        where: criteria,
        offset,
        limit
      });
  
      return products;
    } catch (error) {
      throw new Error('Error while searching products');
    }
  };
  
