"use client"

import { Message, Pal } from '@prisma/client'
import React, { useState } from 'react'
import ChatHeader from './chat-header';
import ChatForm from './chat-form';
import { useCompletion } from "ai/react"
import { PalMessageProps } from './pal-message';
import { useRouter } from 'next/navigation';

type Props = {
    pal: Pal & {
        messages: Message[];
        _count: {
            messages: number;
        }
    }
}

const ChatClient = ({ pal }: Props) => {

    const router = useRouter();
    const [messages, setMessages] = useState<PalMessageProps[]>(pal.messages)

    const { input, isLoading, handleInputChange, handleSubmit, setInput } = useCompletion({
        api: `/api/chat/${pal.id}`,
        onFinish(prompt, completion) {
            const palMessage: PalMessageProps = {
                role: "pal",
                content: completion
            };
            setMessages((current) => [...current, palMessage]);
            setInput("");
        }
    })

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const userMessage: PalMessageProps = {
            role: "user",
            content: input
        };
        setMessages((current) => [...current, userMessage]);
        handleSubmit(e);
    }

    return (
        <div className='flex flex-col h-full p-4'>
            <ChatHeader pal={pal} />
            <ChatForm
                isLoading={isLoading}
                input={input}
                handleInputChange={handleInputChange}
                onSubmit={onSubmit}
            />
        </div>
    )
}

export default ChatClient