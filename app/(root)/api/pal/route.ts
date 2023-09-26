
import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { currentUser } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const user = await currentUser();

        const subscription = checkSubscription();

        const { src, name, description, instructions, seed } = body;

        if (!user || !user.firstName) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const palsCreatedByUser = await prismadb.pal.findMany({
            where: {
                userName: user.firstName,
            },
        });

        if (palsCreatedByUser.length > 1 && !subscription) {
            return new NextResponse("No Pro Subscription", { status: 401 });
        }
        else {
            const pal = await prismadb.pal.create({
                data: {
                    name,
                    src,
                    description,
                    instructions,
                    seed,
                    userName: user.firstName,
                    userId: user.id
                }
            });

            return NextResponse.json(pal);
        }

    } catch (error) {
        console.error("[PAL_POST_ERROR]: ", error);
        return new NextResponse("Invalid Request", { status: 500 });
    }
}