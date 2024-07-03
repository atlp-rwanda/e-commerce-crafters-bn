import { Request, Response } from "express";
import Wishlist from "../database/models/wishlist";
import WishlistItem from "../database/models/wishlistItem";
import User from "../database/models/user";
import Product from "../database/models/product";

export const fetchWishlist = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const wishlist = await Wishlist.findOne({ where: { userId } });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    const wishlistItems = await WishlistItem.findAll({
      where: { wishlistId: wishlist.wishlistId },
    });

    return res.status(200).json({ wishlist: wishlistItems });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const { userId, productId, price } = req.body;

    let wishlist = await Wishlist.findOne({ where: { userId } });

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId });
      await User.update({ wishlistId: wishlist.wishlistId }, { where: { userId } });

      const wishlistItem = await WishlistItem.create({
        wishlistId: wishlist.wishlistId,
        productId,
      });
      if (wishlistItem) {
        return res
          .status(200)
          .json({ message: "Wishlist added successfully!", wishlist: wishlistItem });
      }
    } else {
      const existedProduct = await WishlistItem.findOne({
        where: {
          wishlistId: wishlist.wishlistId,
          productId,
        },
      });
      if (existedProduct) {
        return res.status(409).json({ message: "Product already exists in wishlist" });
      }
      const wishlistItem = await WishlistItem.create({
        wishlistId: wishlist.wishlistId,
        productId,
        price,
      });
      if (wishlistItem) {
        return res
          .status(200)
          .json({ message: "Wishlist item added successfully!", wishlist: wishlistItem });
      }
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const { userId, productId } = req.body;

    const wishlist = await Wishlist.findOne({ where: { userId } });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    const wishlistItem = await WishlistItem.findOne({
      where: {
        wishlistId: wishlist.wishlistId,
        productId,
      },
    });

    if (!wishlistItem) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    await WishlistItem.destroy({
      where: {
        wishlistId: wishlist.wishlistId,
        productId,
      },
    });

    return res.status(200).json({ message: "Product removed from wishlist successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
