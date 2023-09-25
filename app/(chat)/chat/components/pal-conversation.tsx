"use client"

import React, { ElementRef, useEffect, useRef, useState } from 'react'
import PalMessage, { PalMessageProps } from './pal-message'
import { Pal } from '@prisma/client'

type Props = {
    message: PalMessageProps[],
    isLoading: boolean, //loading state
    pal: Pal //information about pal
}

const PalConversation = ({ message = [], isLoading, pal }: Props) => {

    const scrollRef = useRef<ElementRef<"div">>(null); // a reference scroll element refering to empty div element

    const [loading, setLoading] = useState(message.length === 0 ? true : false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => {
            clearTimeout(timeout);;
        }
    }, []);

    useEffect(() => {
        //used to scroll to the most recent chat message when new messages are added
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [message.length])

    return (
        <div className='flex-1 overflow-y-auto pr-4 mt-5'>
            {/*This is for displaying the first message of the conversation which is sort of introduction 
            of the pal */}
            <PalMessage
                isLoading={loading} //if loading is true, a spinner will be displayed else content
                src={pal.src}  //pal image
                role={"pal"} //role of the message sender
                content={`Hello, I am ${pal.name}, ${pal.description} `} // content
            />
            {
                //if messages are present, it is lopped over to print out the message
                message.map((message) => (
                    <PalMessage
                        key={message.role}
                        role={message.role}//role associated with the message
                        content={message.content} //content of the message
                        src={pal.src}
                    />
                ))
            }
            {
                isLoading && (
                    //if loading is true, the message will work. It will fetch and display the message of the Pal
                    <PalMessage
                        role='pal' //role associated with the message
                        src={pal.src} //picture of the pal
                        isLoading
                    />
                )
            }
            <div ref={scrollRef} />
        </div>
    )
}

export default PalConversation