import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe"
import { absoluteUrl } from "@/lib/utils";

const settingsUrl = absoluteUrl("/settings");

export const GET = async () => {
    try {
        const { userId } = auth();
        const user = await currentUser();
        if (!userId) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        const userSubscription = await prismadb.userSubscription.findUnique({
            //find users who have active subscription
            where: {
                userId
            }
        });

        if (userSubscription && userSubscription.stripeCustomerId) {
            //if user is subscribed, they will be redirected towards billing portal of stripe
            const stripeSession = await stripe.billingPortal.sessions.create({
                //stripe session for billing portal
                customer: userSubscription.stripeCustomerId,
                return_url: settingsUrl
            });

            //returning stripe session url
            return new NextResponse(JSON.stringify({ url: stripeSession.url }));
        }

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsUrl,//where the user will be redirected when checkout is completed
            cancel_url: settingsUrl, //where the user will be redirected when checkout fails
            payment_method_types: ["card", "paypal"], //methods for payment
            mode: "subscription", //what type of checkout it is
            billing_address_collection: "auto", //customer billing address is automatically collected
            customer_email: user?.emailAddresses[0].emailAddress,
            line_items: [
                //cart items 
                {
                    price_data: {
                        currency: "USD", //curreny to use
                        product_data: { //company name and its description
                            name: "PersonaPal",
                            description: "Create Your Own Pals"
                        },
                        unit_amount: 999, //currency
                        recurring: {
                            interval: "month" //monthly subscription
                        }
                    },
                    quantity: 1, //quantity of item 
                }
            ],
            metadata: {
                userId,
            }
        })

        return new NextResponse(JSON.stringify({ url: stripeSession.url })); //stripe session url returned

    } catch (error) {
        console.log("[STRIPE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}