import prismadb from '@/lib/prismadb';
import { auth, redirectToSignIn } from '@clerk/nextjs'
import React from 'react'

interface PalProps {
    params: {
        palId: string
    }
}

const Bot = async ({ params }: PalProps) => {

    const { userId } = auth();

    if (!userId) {
        return redirectToSignIn();
    }

    const initalData = await prismadb.pal.findUnique({
        where: {
            id: params.palId,
            userId //only user who created it change the b
        }
    })

    return (
        <div>Bot</div>
    )
}

export default Bot