import Order from "../database/models/order"
import Product from "../database/models/product"


export const findOrderById = async (orderId: any)=>{
    const order = await Order.findByPk(orderId)
    return order
}
export const findProductById = async (productId:any)=>{
    const product = await Product.findByPk(productId)
    return product
}