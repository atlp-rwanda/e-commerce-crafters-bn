import { Response,Request } from "express"
import Order from "../database/models/order"


import Review from "../database/models/review"
import { Op } from "sequelize"

export const addReview = async (req:Request,res:Response)=>{
    try {
        
    const userId = req.params.id
    const {productId,rating,feedback}  = req.body

    const viewOrder = await Order.findOne({where:{
        userId,
        status: "completed",
        products:{
          [Op.contains]: [{productId:productId}]

        }
    }})
    if(!viewOrder){
        return res.status(400).json({message: " User has not bougth this product"})
    }

    const addReview = await Review.create({
        userId,
        productId,
        rating,
        feedback
    })
    res.status(200).json({message: "Review created successfully", review: addReview})
} catch (error:any) {
    res.status(500).json({error: error.messgae})
        
}

}

