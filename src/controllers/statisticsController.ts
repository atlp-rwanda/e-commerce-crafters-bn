import { Request, Response } from "express";
import { Op, Sequelize } from "sequelize";
import Order from "../database/models/order";
import Product from "../database/models/product";
import { checkVendorPermission } from "../services/PermisionService";
export const getStatistics = async (req: Request, res: Response) => {
  const tokenData = (req as any).token;
  const { vendorId } = req.params;
  const { startDate, endDate } = req.body;

  try {
    const permissionCheck: any = await checkVendorPermission(
      tokenData,
      vendorId
    );

    if (!permissionCheck.allowed) {
      return res
        .status(permissionCheck.status)
        .json({ message: permissionCheck.message });
    }

    const orderedProduct: any[] = [];
    let whereClause: any = {};

    if (startDate && endDate) {
      whereClause = {
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn("DATE_TRUNC", "day", Sequelize.col("createdAt")),
            {
              [Op.gte]: new Date(startDate),
              [Op.lte]: new Date(endDate),
            }
          ),
        ],
      };
    }

    const orders = await Order.findAll({ where: whereClause });

    orders.forEach((order) => {
      if (order.products && Array.isArray(order.products)) {
        order.products.forEach((product: any) => {
          if (product) {
            orderedProduct.push({
              productId: product.productId,
              quantity: product.quantity,
              customerId: order.userId,
            });
          }
        });
      }
    });

    let numberOfProduct = 0;
    let totalAmount = 0;
    let uniqueCustomers = new Set();
    let productsMap: any = {};

    await Promise.all(
      orderedProduct.map(async (item) => {
        const vendorProduct: any = await Product.findOne({
          where: {
            productId: item.productId,
            vendorId: vendorId,
          },
        });

        if (!vendorProduct) {
          return;
        }

        totalAmount += vendorProduct.price * item.quantity;
        uniqueCustomers.add(item.customerId);

        if (productsMap[item.productId]) {
          productsMap[item.productId].quantity += item.quantity;
          productsMap[item.productId].totalAmount +=
            vendorProduct.price * item.quantity;
        } else {
          productsMap[item.productId] = {
            productId: item.productId,
            quantity: item.quantity,
            totalAmount: vendorProduct.price * item.quantity,
          };
          numberOfProduct += 1;
        }
      })
    );

    let productsArray = Object.values(productsMap);
    productsArray.sort((a: any, b: any) => b.quantity - a.quantity);

    let hotSales = productsArray;

    return res.json({
      numberOfProduct,
      totalAmount,
      hotSales,
      uniqueCustomers: uniqueCustomers.size,
    });
  } catch (error: any) {
    console.error(error);
    if (!res.headersSent) {
      return res.status(500).json({ error: error.message });
    }
  }
};
