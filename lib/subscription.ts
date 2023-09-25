import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

const DAY_IN_MS = 86_400_000;
//defines a constant which represents the number of milliseconds in one day.

export const checkSubscription = async () => {
    const { userId } = auth();
    //gets the userId fro the auth

    if (!userId) {
        //if no user exist
        return false;
    }

    const userSubscription = await prismadb.userSubscription.findUnique({
        /*uses Prisma userSubscription model to query the database for 
        a user's subscription details on their userId */
        where: {
            userId: userId,
        },
        //selects specific field of the user subscription
        select: {
            stripeSubscriptionId: true,
            stripeCurrentPeriodEnd: true,
            stripeCustomerId: true,
            stripePriceId: true,
        },
    })

    if (!userSubscription) {
        //if user is not subscribed, return false
        return false;
    }

    //if user is found, the following line checks whether it has a valid subscription
    const isValid =
        //ensures that stripePriceId is true and that the current date is not the date subscription will expire
        userSubscription.stripePriceId &&
        userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()

    return !!isValid;
};