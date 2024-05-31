import { Request, Response } from "express";
import Order from "../database/models/order";

const updateOrderStatus = async (
  req: Request,
  res: Response,
  newStatus: string,
  successMessage: string
) => {
  try {
    const { orderId } = req.params;
    const userId = (req as any).token.userId;

    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Only the vendor can update the order status" });
    }

    order.status = newStatus;
    await order.save();

    res.status(200).json({ message: successMessage, order });
  } catch (error) {
    console.error(`Failed to update order status: ${error}`);
    res.status(500).json({ error: "Failed to update order status" });
  }
};

export const orderShippedStatus = (req: Request, res: Response) => {
  updateOrderStatus(req, res, "Shipped", "Order has shipped");
};

export const orderPendingStatus = (req: Request, res: Response) => {
  updateOrderStatus(req, res, "Pending", "Order in progress");
};

export const orderDeliveredStatus = (req: Request, res: Response) => {
  updateOrderStatus(req, res, "Delivered", "Order has been delivered");
};

export const orderCancelledStatus = (req: Request, res: Response) => {
  updateOrderStatus(req, res, "Delivered", "Order has been cancelled");
};
