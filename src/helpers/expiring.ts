import Product from "../database/models/product";
import Vendor from "../database/models/vendor";
import User from "../database/models/user";
import { Op } from "sequelize";

const checkExpiringProducts = async () => {
 const vendors = await Product.findAll({
  where: {
   expiringDate: {
    [Op.between]: [
     new Date(),
     new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).getTime(),
    ],
   },
  },
  // include: [
  //  {
  //   model: Vendor,
  //   // include: [
  //   //  {
  //   //   model: User,
  //   //   attributes: ["email"],
  //   //  },
  //   // ],
  //  },
  // ],
 });
 const data = vendors.map((product) => product.toJSON());
 console.log(data);
};
checkExpiringProducts();
