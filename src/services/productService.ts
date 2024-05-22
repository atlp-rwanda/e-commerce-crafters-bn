import Product from "../database/models/product"

export const saveProduct = async (data:any)=>{
    const response = await Product.create(data)
    if(response){
        return true
    }else{
        return false
    }
}