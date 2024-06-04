
import { Request, Response } from "express";
import Order from "../database/models/order";

const allowedStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const userId = (req as any).token.userId;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid order status" });
    }

    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Only the vendor can update the order status" });
    }

    order.status = status;
    await order.save();

    res
      .status(200)
      .json({ message: `Order has been ${status.toLowerCase()}`, order });
  } catch (error:any) {
    console.error(`Failed to update order status: ${error}`);
    res.status(500).json({ error: error.message });
  }
};