
import { Request, Response } from "express";
import Order from "../database/models/order";
import { findVendorByUserId } from "../services/orderStatus";
import Product from "../database/models/product";

const allowedStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];

export const modifyOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const userId = (req as any).token.id;

    const vendor = await findVendorByUserId(userId);
    if (!vendor) {
      return res.status(404).json({ message: "No vendor found" });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid order status" });
    }

    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    let isOrderDelivered = true;
    const updateProductStatusPromises = order.products.map(
      async (item: any) => {
        const productId = item.productId;
        const isVendorProduct = await Product.findOne({
          where: { productId, vendorId: vendor.vendorId },
        });
        if (isVendorProduct) {
          item.status = status;
        }
        if (item.status !== "Delivered") {
          isOrderDelivered = false;
        }
      }
    );

    await Promise.all(updateProductStatusPromises);
    await Order.update({ products: order.products }, { where: { orderId } });

    let newOrderStatus = order.status;
    if (isOrderDelivered) {
      newOrderStatus = "Delivered";
    } else {
      newOrderStatus = "Pending";
    }

    await Order.update({ status: newOrderStatus }, { where: { orderId } });

    return res.status(200).json({
      message: `Order has been ${status.toLowerCase()}`,
      order,
    });
  } catch (error: any) {
    console.error(`Failed to update order status: ${error}`);
    res.status(500).json({ error: error.message });
  }
};



