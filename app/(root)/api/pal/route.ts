import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { currentUser } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        console.log("API called");
        const body = await request.json();
        console.log(body);
        const user = await currentUser();
        console.log(user?.id);
        console.log(user?.firstName);

        const subscription = await checkSubscription();
        console.log(subscription);

        const { src, name, description, instructions, seed } = body;

        if (!user || !user.firstName) {
            console.log("Unauthorized if run");
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const palsCreatedByUser = await prismadb.pal.findMany({
            where: {
                userId: user.id,
                userName: user.firstName,
            },
        });

        console.log(palsCreatedByUser);

        if (palsCreatedByUser.length >= 1 && !subscription) {
            // Use NextResponse.redirect to perform the redirect
            return NextResponse.redirect("/");
        } else {
            const pal = await prismadb.pal.create({
                data: {
                    name,
                    src,
                    description,
                    instructions,
                    seed,
                    userName: user.firstName,
                    userId: user.id,
                },
            });

            return NextResponse.json(pal);
        }
    } catch (error) {
        console.error("[PAL_POST_ERROR]: ", error);
        return new NextResponse("Invalid Request", { status: 500 });
    }
};
