import { Message, Pal } from '@prisma/client'
import React from 'react'
import ChatHeader from './chat-header';

type Props = {
    pal: Pal & {
        messages: Message[];
        _count: {
            messages: number;
        }
    }
}

const ChatClient = ({ pal }: Props) => {
    return (
        <div className='flex flex-col h-full p-4'>
            <ChatHeader pal={pal} />
        </div>
    )
}

export default ChatClient