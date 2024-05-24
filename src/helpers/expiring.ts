import Product from "../database/models/product";
import Vendor from "../database/models/vendor";
import User from "../database/models/user";
import { Op } from "sequelize";
import cron from "node-cron";
const checkExpiringProducts = async () => {
 const productsData = await Product.findAll({
  where: {
   expiringDate: {
    [Op.between]: [
     new Date(),
     new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).getTime(),
    ],
   },
  },
 });
 const jsonProducts = productsData.map((product) => product.toJSON());
 const organizedProducts = jsonProducts.reduce((acc, product) => {
  const { vendorId } = product;
  if (!acc[vendorId]) {
   acc[vendorId] = [];
  }
  acc[vendorId].push(product.name);
  return acc;
 }, {});
 const vendorsData = await Vendor.findAll({
  where: {
   vendorId: Object.keys(organizedProducts),
  },
 });
 const jsonVendors = vendorsData.map((vendor) => vendor.toJSON());
 const organizedVendors = jsonVendors.reduce((acc, vendor) => {
  const { userId, vendorId } = vendor;
  if (!acc[userId]) {
   acc[userId] = vendorId;
  }
  acc[userId] = vendorId;
  return acc;
 }, {});
 const usersData = await User.findAll({
  where: {
   userId: Object.keys(organizedVendors),
  },
 });
 let send = {};
 const jsonUsers = usersData.map((user) => user.toJSON());
 jsonUsers.forEach((user) => {
  const { email } = user;
  const userIds = Object.keys(organizedVendors);
  userIds.forEach((id) => {
   if (id === user.userId) {
    send[email] = organizedProducts[organizedVendors[id]];
   }
  });
 });
};

cron.schedule("0 12 * * 0/14", checkExpiringProducts);
