import { Request, Response } from "express";
import Cart from "../database/models/cart";
import CartItem from "../database/models/cartitem";
import User from "../database/models/user";

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { userId, productId, quantity, price } = req.body;

    let cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      cart = await Cart.create({
        userId,
      });
      await User.update({ cartId: cart.cartId }, { where: { userId } });

      const cartItem = await CartItem.create({
        cartId: cart.cartId,
        productId,
        quantity,
        price,
      });
      if (cartItem) {
        return res.status(200).json({ message: "cart added successfully!",cart:cartItem  });
      }
    } else {
      const existedProduct = await CartItem.findOne({
        where: {
          cartId:cart.cartId,
          productId,
        },
      });
      if (existedProduct){
        return res.status(409).json({message:"product is already exists"})
      }
      const cartItem = await CartItem.create({
        cartId: cart.cartId,
        productId,
        quantity,
        price,
      });
      if (cartItem) {
        return res.status(200).json({ message: "cart added successfully!",cart:cartItem });
      }
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
