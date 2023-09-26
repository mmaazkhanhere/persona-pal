import Stripe from "stripe";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
    const body = await req.text();

    async function getSignature() {
        const signature = req.headers.get("Stripe-Signature") as string;
        return new Promise<string>((resolve) =>
            setTimeout(() => {
                resolve(signature);
            }, 1000)
        );
    }

    const signature = await getSignature();

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        console.error("[Stripe Webhook Error]", error);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    console.log("[Stripe Webhook Event]", event);

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "invoice.payment_succeeded") {
        // Handle successful payment event, if needed
    } else if (event.type === "customer.subscription.deleted") {
        if (!session?.metadata?.userId) {
            return new NextResponse("User id is required", { status: 400 });
        }

        try {
            await prismadb.userSubscription.delete({
                where: {
                    userId: session?.metadata?.userId,
                },
            });
        } catch (error) {
            console.error("[Prisma]", error);
            return new NextResponse("Error deleting user subscription", {
                status: 500,
            });
        }
    }

    return new NextResponse(null, { status: 200 });
}
