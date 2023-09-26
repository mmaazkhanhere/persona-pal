import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: { palId: string } }) {
    try {
        const { userId } = auth();//gets user info
        console.log(userId)
        const subscription = await checkSubscription();
        console.log(subscription)

        if (!userId || !subscription) {
            //if no authenticated user present, then 401 error
            return new NextResponse("Unauthorised", { status: 401 });
        }

        //delete a companion object in the database based on the "userId" and companionId from the route parameters
        const companion = await prismadb.pal.delete({
            where: {
                userId,
                id: params.palId,
            }
        });
        console.log(companion)

        return NextResponse.json(companion);//retunrs a JSON response with the deleted companion object

    } catch (error) {
        console.log("[COMPANION_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}