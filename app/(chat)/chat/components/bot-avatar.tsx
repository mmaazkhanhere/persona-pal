import { Avatar, AvatarImage } from '@/components/ui/avatar'
import React from 'react'

type Props = {
    src: string
}

const BotAvatar = (props: Props) => {
    return (
        <Avatar className='w-16 h-16'>
            <AvatarImage src={props.src} />
        </Avatar>
    )
}

export default BotAvatar