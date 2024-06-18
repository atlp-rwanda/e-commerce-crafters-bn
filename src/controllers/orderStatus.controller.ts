import { Request, Response } from "express";
import Order from "../database/models/order";
import { ioServer } from "..";
import pusher from "../pusher";

export const getOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ where: { orderId } });

    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }
    res
      .status(200)
      .json({
        orderId,
        status: order.status,
        expectedDeliveryDate: order.expectedDeliveryDate,
      });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const status = req.body.status;

    const validStatus = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "on hold",
      "cancelled",
    ];

    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findOne({ where: { orderId: orderId } });

    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    order.status = status;

    if (status === "processing") {
      const currentDate = new Date();
      const expectedDeliveryDate = new Date(
        currentDate.getTime() + 14 * 24 * 60 * 60 * 1000
      );

      order.expectedDeliveryDate = expectedDeliveryDate;
    }

    await order.save();

    const formattedDate = order.expectedDeliveryDate
      ? order.expectedDeliveryDate.toLocaleDateString()
      : null;

    try {
      await pusher.trigger("e-commerce-crafters", "orderStatusUpdated", {
        orderId,
        status: order.status,
        expectedDeliveryDate: formattedDate,
      });
    } catch (error) {
      console.error("Failed to trigger Pusher event:", error);
    }

    ioServer.emit("orderStatusUpdated", {
      orderId,
      status: order.status,
      expectedDeliveryDate: formattedDate,
    });
    res
      .status(200)
      .json({
        orderId,
        status: order.status,
        expectedDeliveryDate: formattedDate,
      });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
