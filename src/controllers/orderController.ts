import { Request, Response } from "express";
import Order from "../database/models/order";
import { findVendorByUserId } from "../services/orderStatus";

const allowedStatuses = ["pending", "shipped", "delivered", "cancelled"];

export const modifyOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId, productId } = req.params;
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
    const updatedProducts = order.products.map((item: any) => {
      if (item.productId === productId) {
        item.status = status;
      }

      if (item.status !== "delivered") {
        isOrderDelivered = false;
      }
      return item;
    });

    order.products = updatedProducts;

    order.status = isOrderDelivered ? "delivered" : "pending";

    await Order.update(
      { products: updatedProducts, status: order.status },
      { where: { orderId: orderId } }
    );

    const updatedOrder = await Order.findByPk(orderId);

    return res.status(200).json({
      message: `Product status has been updated to ${status.toLowerCase()}`,
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error(`Failed to update product status: ${error}`);
    res.status(500).json({ error: error.message });
  }
};

export const getAllOrder = async (req: Request, res: Response) => {
  try {
    const response = await Order.findAll();

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal error server" });
  }
};
