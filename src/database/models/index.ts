"use strict";

import Admin from "./admin";
import Cart from "./cart";
import CartItem from "./cartitem";
import Message from "./messages";
import Order from "./order";
import Product from "./product";
import Rating from "./rating";
import Review from "./review";
import Subscription from "./subscription";
import User from "./user";
import Vendor from "./vendor";
import Wishlist from "./wishlist";
import WishlistItem from "./wishlistItem";

const models = {
  User,
  Cart,
  Vendor,
  Product,
  Wishlist,
  CartItem,
  Order,
  Admin,
  Message,
  Subscription,
  Rating,
  Review,
  WishlistItem,
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export default models;
