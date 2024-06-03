import { Response, Request } from "express";
import Order from "../database/models/order";

import Review from "../database/models/review";
import { Op, where } from "sequelize";
import models from "../database/models";
import Rating from "../database/models/rating";

export const addReview = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { productId, rating, feedback } = req.body;
    if(rating && rating > 5){
      return res.status(402).json({message: "Rating is between 0 and 5"})

    }

    const viewOrder = await Order.findOne({
      where: {
        userId,
        products: {
          productId
        },
      },
    });
    if (!viewOrder) {
      return res
        .status(400)
        .json({ message: " User has not bougth this product" });
    }

    const addReview = await Review.create({
      userId,
      productId,
      rating,
      feedback,
    });
    res
      .status(200)
      .json({ message: "Review created successfully", review: addReview });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const selectReview = async (req: Request, res: Response) => {
  try {
    const vendorId = req.params.id;
    const review = await Review.findAll({
      include: [
        {
          model: models.Product,
          where: { vendorId: vendorId },
        },
      ],
    });
    if (!review || review.length === 0) {
      return res
        .status(400)
        .json({ message: "There in no review in your products" });
    }
    return res.status(200).json({ review: review });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addFeedback = async (req:Request,res:Response)=>{
  try {
    const {name,ratingScore,feedback}  = req.body
    const productId  = req.params.id
    if(!name){
      return res.status(402).json({message: "You must add your name"})
    }
    if(ratingScore && ratingScore > 5){
      return res.status(402).json({message: "enter rating between 0 and 5"})

    }
    const saveData = await Rating.create({
      name,
      ratingScore,  
      feedback,
      productId
    })
    if(!saveData){
      return res.status(400).json({message: "error in saving data"})
    }
    res.status(201).json({message: "feedback created",data: saveData})
    
  } catch (error:any) {
    return res.status(500).json({error: error.message})
    
  }
}
