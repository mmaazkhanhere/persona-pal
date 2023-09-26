import Stripe from "stripe"
import { NextRequest, NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"
import { stripe } from "@/lib/stripe"

export const POST = async (request: NextRequest) => {
    const body = await request.json();

    const signature = request.headers.get("Stripe-Signature") as string; //getting stripe signature from the headers

    let event: Stripe.Event // creating a strip event

    try {
        event = stripe.webhooks.constructEvent(
            //stripe event constructed
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        //if any error webhook creation, displau webhook error
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session //event object assigned as Stripe Checkout to access subscription related data

    if (event.type === "checkout.session.completed") {
        //if session is completed, it retrives the subscription information
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        )

        if (!session?.metadata?.userId) {
            //if user is missing, 400 status error
            return new NextResponse("User Id is required", { status: 400 });
        }

        await prismadb.userSubscription.create({
            //creating userSubscription record in the database
            data: {
                userId: session?.metadata?.userId,
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer as string,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(
                    subscription.current_period_end * 1000
                )
            }
        })
    }

    if (event.type === "invoice.payment_succeeded") {
        //if invoice payment succeeded, subscription information is retreved
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        )

        await prismadb.userSubscription.update({
            //create user subscription record in the database
            where: {
                stripeSubscriptionId: subscription.id
            },
            data: {
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(
                    subscription.current_period_end * 1000
                )
            }
        })
    }

    return new NextResponse("Error in webhook", { status: 200 })
}