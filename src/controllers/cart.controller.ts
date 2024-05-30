import { Request, Response } from "express";
import Cart from "../database/models/cart";
import CartItem from "../database/models/cartitem";
import User from "../database/models/user";
import Product from "../database/models/product";

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
        return res
          .status(200)
          .json({ message: "cart added successfully!", cart: cartItem });
      }
    } else {
      const existedProduct = await CartItem.findOne({
        where: {
          cartId: cart.cartId,
          productId,
        },
      });
      if (existedProduct) {
        return res.status(409).json({ message: "product is already exists" });
      }
      const cartItem = await CartItem.create({
        cartId: cart.cartId,
        productId,
        quantity,
        price,
      });
      if (cartItem) {
        return res
          .status(200)
          .json({ message: "cart added successfully!", cart: cartItem });
      }
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCart = async (req: Request, res: Response) => {
  try {
    const updates = req.body.updates;

    for (const update of updates) {
      const { productId, quantity } = update;

      const product = await Product.findOne({ where: { productId } });
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product ${productId} Not Found` });
      }

      if (
        quantity <= 0 ||
        !Number.isInteger(quantity) ||
        product.quantity < quantity
      ) {
        return res.status(400).json({
          message: `Only ${product.quantity} ${product.name} available In store`,
        });
      }
    }

    for (const update of updates) {
      const { cartId, productId, quantity, price } = update;
      const cartItem = await CartItem.findOne({
        where: { cartId, productId },
      });
      if (!cartItem) {
        return res
          .status(404)
          .json({ message: `Cart Items for Product ${productId} Not Found` });
      }

      await CartItem.update(
        { quantity, price },
        { where: { cartId, productId } }
      );
    }
    const cartItems = await CartItem.findAll({
      where: { cartId: updates[0].cartId },
    });
    const cartTotal = await CartItem.sum("price", {
      where: { cartId: updates[0].cartId },
    });

    return res.status(200).json({
      message: "Cart items updated successfully!",
      cartItems: cartItems,
      total: cartTotal,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
