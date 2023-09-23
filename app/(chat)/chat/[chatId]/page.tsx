import prismadb from '@/lib/prismadb'
import { auth, redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'
import ChatClient from '../components/chat-client'

type Props = {
    params: {
        chatId: string
    }
}

const ChatId = async ({ params }: Props) => {

    const { userId } = auth();

    if (!userId) {
        return redirectToSignIn();
    }

    const pal = await prismadb.pal.findUnique({
        where: {
            id: params.chatId
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: "asc"
                },
                where: {
                    userId
                }
            },
            _count: {
                select: {
                    messages: true
                }
            }
        }
    });

    if (!pal) {
        return redirect("/");
    }

    return (
        <div>
            <ChatClient pal={pal} />
        </div>
    )
}

export default ChatId