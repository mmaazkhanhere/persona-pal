"use client"

import React, { ElementRef, useEffect, useRef } from 'react'
import PalMessage, { PalMessageProps } from './pal-message'
import { Pal } from '@prisma/client'

type Props = {
    message: PalMessageProps[],
    isLoading: boolean, //loading state
    pal: Pal //information about pal
}

const PalConversation = ({ message = [], isLoading, pal }: Props) => {

    const scrollRef = useRef<ElementRef<"div">>(null); // a reference scroll element refering to empty div element

    useEffect(() => {
        //used to scroll to the most recent chat message when new messages are added
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [message.length])

    return (
        <div className='flex-1 overflow-y-auto pr-4'>
            <PalMessage isLoading={false} src={pal.src} role={"pal"}
                content={`Hello, I am ${pal.name}, ${pal.description} `}
            />
            {
                message.map((message) => (
                    <PalMessage
                        key={message.role}
                        role={message.role}
                        content={message.content}
                        src={message.src}
                    />
                ))
            }
            {
                isLoading && (
                    <PalMessage
                        role='pal'
                        src={pal.src}
                        isLoading
                    />
                )
            }
            <div ref={scrollRef} />
        </div>
    )
}

export default PalConversation