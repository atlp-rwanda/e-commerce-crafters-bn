import express, { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { findOrderById, findProductById } from "../services/paymentService";

dotenv.config();

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);
export const checkout = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    const order = await findOrderById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const line_items: any[] = await Promise.all(
      order.products.map(async (item: any) => {
        const productDetails = await findProductById(item.productId);
        const unit_amount = Math.round(productDetails!.price * 100);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.productName,
              images: [productDetails?.image],
            },
            unit_amount: unit_amount,
          },
          quantity: item.quantity,
        };
      })
    );

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: process.env.SUCCESS_PAYMENT_URL,
      cancel_url: process.env.CANCEL_PAYMENT_URL,
      metadata: {
        orderId: orderId,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const webhook = async (req: Request, res: Response) => {
  const sig: any = req.headers["stripe-signature"];
  const webhookSecret: any = process.env.WEBHOOK_SECRET_KEY;
  let event: any;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;

      try {
        const lineItems = await stripe.checkout.sessions.listLineItems(
          session.id
        );

        const orderId = session.metadata.orderId;
        const order = await findOrderById(orderId);
        if (order) {
          order.status = "paid";
          await order.save();
        } else {
          console.error("Order not found:", orderId);
        }
      } catch (err) {
        console.error("Error processing session completed event:", err);
      }
      break;

    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log("Payment Intent succeeded: ", paymentIntent);
      break;
    case "payment_method.attached":
      const paymentMethod = event.data.object;
      console.log("Payment Method attached: ", paymentMethod);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  res.json({ received: true });
};
