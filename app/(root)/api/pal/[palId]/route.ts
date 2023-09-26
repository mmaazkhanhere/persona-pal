import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { currentUser } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (request: NextRequest, { params }: { params: { palId: string } }) => {
    try {
        const body = await request.json();
        const user = await currentUser();
        const subscription = await checkSubscription();

        if (!params.palId) {
            return new NextResponse("Missing details", { status: 400 });
        }

        if (!user || !subscription) {
            return new NextResponse("Unauthorised", { status: 401 });
        }
        else {
            const pal = await prismadb.pal.delete({
                where: {
                    userId: user.id,
                    id: params.palId
                }
            });

            return NextResponse.json(pal);
        }

    } catch (error) {
        console.log("[COMPANION_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}