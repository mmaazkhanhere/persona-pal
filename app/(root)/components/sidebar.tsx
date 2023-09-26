"use client"

import React, { useState } from 'react'
import { usePathname, useRouter } from "next/navigation"

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { UserButton, useUser } from '@clerk/nextjs'

import { Plus, Settings, Zap } from 'lucide-react'
import { ModeToggle } from './mode-toggle'
import axios from 'axios'


const Sidebar = () => {

    const [loading, setLoading] = useState(false);

    const routes = [
        {
            title: 'Create',
            icon: Plus,
            href: '/pal/new',
            pro: true
        },
        {
            title: 'Settings',
            icon: Settings,
            href: '/settings',
            pro: false
        }
    ]

    const { user } = useUser();
    const pathname = usePathname();
    const router = useRouter();

    const onClick = (href: string) => {
        router.push(href);
    }

    return (
        <div className='flex flex-col items-center justify-center h-full w-20 gap-y-3 text-sm'>
            {
                routes.map((route) =>
                    <div key={route.title}
                        className={cn(`group p-2 w-full cursor-pointer rounded-lg hover:bg-primary/60
                    text-primary/80 hover:text-primary transition`,
                            pathname === route.href && "bg-slate-300 text-gray-600"
                        )}
                    >
                        <div className='flex flex-col gap-y-2 items-center justify-center'
                            onClick={() => onClick(route.href)}
                        >
                            <route.icon />
                            {route.title}
                        </div>
                    </div>
                )
            }
            <div className='p-2 w-full cursor-pointer rounded-lg hover:bg-primary/60
                    text-primary/80 hover:text-primary transition flex items-center justify-center'>
                <ModeToggle />
            </div>
            <div className='p-2 w-full cursor-pointer rounded-lg hover:bg-primary/60
            text-primary/80 hover:text-primary transition flex flex-col items-center 
            justify-center gap-y-2'>
                <UserButton afterSignOutUrl='/sign-in' />
                {user?.firstName}
            </div>
        </div>
    )
}

export default Sidebar