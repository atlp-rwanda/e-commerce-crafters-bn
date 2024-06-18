import Order from "../database/models/order";
import Cart from "../database/models/cart";
import CartItem from "../database/models/cartitem";
import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';


export const createOrder = async (req: Request, res: Response) => {
    const { userId, deliveryAddress, paymentMethod } = req.body;
    if(!userId || !deliveryAddress || !paymentMethod) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    try {
        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartItems = await CartItem.findAll({ where: { cartId: cart.cartId } });
        if (cartItems.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }

        const orderItems = cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            status:"pending"
        }));

        const totalAmount = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);

        const order = await Order.create({
            orderId: uuidv4(),
            deliveryAddress,
            userId,
            paymentMethod,
            status: 'pending', 
            products: orderItems,
            totalAmount: totalAmount
        });
        await CartItem.destroy({ where: { cartId: cart.cartId } });
        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error: any) {
        res.status(500).json({ message: error.message  });
    }
};
