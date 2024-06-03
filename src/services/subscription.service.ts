import Subscription from "../database/models/subscription"

export const registerSubscription = async (email: String) => {
    const response = await Subscription.create({
        email: email
    })
    if (response) {
        return response
    } else {
        return false
    }
}

export const unsubscribe = async (email: String) => {
    const response = await Subscription.findOne({ where: { email } })

    if (!response) {
        throw new Error("Subscription not found");
    }

    await response.destroy();
}
