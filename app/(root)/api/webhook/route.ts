/* this code handles incoming Stripe webhook events, validates their signatures, 
and performs actions based on the event type. It interacts with a database (likely using prismadb) 
to create or update user subscription records when certain events occur.  */

import Stripe from "stripe"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"
import { stripe } from "@/lib/stripe"

export async function POST(req: Request) {
    const body = await req.text()

    async function getSignature() {
        //async function to retrieve the Stripe signature from the request haeders
        const signature = req.headers.get("Stripe-Signature") as string;
        //simulates an async operation with one second dealy before resolving the signature
        return new Promise<string>((resolve) =>
            setTimeout(() => {
                resolve(signature);
            }, 1000)
        );
    }

    const signature = await getSignature(); //get signature by calling the getSignature function

    let event: Stripe.Event

    try {
        //stripe event constructed
        event = stripe.webhooks.constructEvent(
            //verifies the event's signature and decodes the webhook payload
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        //if any error in construction event it is returned
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }

    const session = event.data.object as Stripe.Checkout.Session

    if (event.type === "checkout.session.completed") {
        //for session completed event, it retrieves the subscription information
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        )

        if (!session?.metadata?.userId) {
            //check if the user id is available
            return new NextResponse("User id is required", { status: 400 });
        }

        await prismadb.userSubscription.create({
            //creates a user subscription record in the database with relevant subscription
            data: {
                userId: session?.metadata?.userId,
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer as string,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(
                    subscription.current_period_end * 1000
                ),
            },
        })
    }

    if (event.type === "invoice.payment_succeeded") {
        //for invoice payment event, it retrieves the subscription information from the event data
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        )

        //updates the user subscription record in the database with relevant subscription
        await prismadb.userSubscription.update({
            where: {
                stripeSubscriptionId: subscription.id,
            },
            data: {
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(
                    subscription.current_period_end * 1000
                ),
            },
        })
    }

    return new NextResponse(null, { status: 200 })
};