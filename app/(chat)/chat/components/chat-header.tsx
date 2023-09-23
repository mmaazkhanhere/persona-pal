import { ChevronLeft, MessageSquare } from 'lucide-react'
import React from 'react'
import BotAvatar from './bot-avatar'
import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { Message, Pal } from '@prisma/client'

type ChatHeaderProps = {
    pal: Pal & {
        messages: Message[];
        _count: {
            messages: number;
        }
    }
}

const ChatHeader = async ({ pal }: ChatHeaderProps) => {

    return (
        <header className='flex items-center justify-between'>
            <nav className='flex items-center justify-start'>
                <ChevronLeft />
                <div className='flex items-center justify-center gap-2'>
                    <BotAvatar src={pal.src} />
                    <div className='flex flex-col items-start justify-center gap-[2px]'>
                        <p className='font-semibold'>{pal.name}</p>
                        <p className='text-xs text-muted-foreground'>{pal.description}</p>
                        <div className='flex items-start justify-center gap-2'>
                            <MessageSquare size={14} />
                            <p className='text-xs text-muted-foreground'>{pal._count.messages}</p>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default ChatHeader