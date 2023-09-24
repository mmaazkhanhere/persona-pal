import { cn } from '@/lib/utils'
import React from 'react'
import BotAvatar from './bot-avatar'

import { PulseLoader } from "react-spinners"
import { useTheme } from 'next-themes'
import UserAvatar from './user-avatar'

export type PalMessageProps = {
    role: "pal" | "user",
    content?: string,
    isLoading?: boolean,
    src?: string
}

const PalMessage = (props: PalMessageProps) => {

    const { theme } = useTheme();

    return (
        <div className={cn(`group flex items-center w-full gap-x-3 py-4 px-2`, props.role === "user" && "justify-end")}>
            {/*Displaying content for pal */}
            {
                props.role === "pal" && props.src && <BotAvatar src={props.src} /> /*If the message is from pal and the pal have
                an image, so the pal avatar is displayed */
            }
            <div className='rounded-md p-2 bg-primary/10 text-sm max-w-sm'>
                {
                    props.isLoading ? <PulseLoader size={5} color={theme === 'light' ? "black" : "white"} /> : props.content
                    /*If pal is thinking, display a pulse loader else display the message content */
                }
            </div>
            {/*Displaying content for user */}
            {
                props.role === "user" && <UserAvatar />
            }
        </div>
    )
}

export default PalMessage