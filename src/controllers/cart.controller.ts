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



export const getCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({
      where: { userId },
      include: [{ model: CartItem, as: "cartItems" }],
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.status(200).json({ cart });
  } catch (error: any) {
    console.log(error)
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    await CartItem.destroy({ where: { cartId: cart.cartId } });

    return res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const deleteProductFromCart = async (req: Request, res: Response) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItem = await CartItem.findOne({
      where: {
        cartId: cart.cartId,
        productId,
      },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    await cartItem.destroy();

    return res.status(200).json({ message: "Product removed from cart successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
