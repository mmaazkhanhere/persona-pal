"use client"

import { ChevronLeft, MessageSquare, MoreVertical, Trash } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import BotAvatar from './bot-avatar'
import { Message, Pal } from '@prisma/client'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { checkSubscription } from '@/lib/subscription'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useToast } from '@/components/ui/use-toast'

type ChatHeaderProps = {
    pal: Pal & {
        messages: Message[];
        _count: {
            messages: number;
        }
    }
}

const ChatHeader = ({ pal }: ChatHeaderProps) => {

    const [sub, setSub] = useState(true);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const checkSub = async () => {
            try {
                const subscription = await checkSubscription();
                console.log(subscription);
                setSub(subscription);
            } catch (error) {
                return null;
            }
        };
        checkSub();
    }, []);

    const handleDelete = async () => {
        //function that runs when clicked on delete icon
        try {
            //sends a DELETE http request at the end point
            await axios.delete(`/api/pal/${pal.id}`);
            toast({
                description: 'Success'
            });
            router.refresh();
            router.push("/");
        } catch (error) {
            //toast runs when error
            toast({
                description: "Something went wrong. Make sure you are a subscriber",
                variant: "destructive"
            })
        }
    }

    return (
        <header className='flex items-center justify-between'>
            <nav className='flex items-center justify-start '>
                <Link href="/">
                    <ChevronLeft />
                </Link>
                <div className='flex items-center justify-center gap-2 ml-4'>
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
            {
                sub && (
                    <nav>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <MoreVertical />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem className='flex items-center justify-center gap-2'
                                    onClick={handleDelete}
                                >
                                    Delete <Trash size={18} />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>
                )
            }

        </header>
    )
}

export default ChatHeader