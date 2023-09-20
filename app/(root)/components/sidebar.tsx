"use client"

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { UserButton, useUser } from '@clerk/nextjs'
import { PersonStanding, Plus, Settings, Zap } from 'lucide-react'
import React from 'react'
import { usePathname } from "next/navigation"
import { useTheme } from 'next-themes'

const Sidebar = () => {

    const routes = [
        {
            title: 'Create',
            icon: Plus,
            href: '/bot/new',
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
    const { setTheme } = useTheme();

    return (
        <div className='flex flex-col items-center justify-center h-full w-20 gap-y-3 text-sm'>
            {
                routes.map((route) =>
                    <div key={route.title}
                        className={cn(`group p-2 w-full cursor-pointer rounded-lg hover:bg-slate-300
                    text-gray-600 hover:text-gray-800 transition`,
                            pathname === route.href && "bg-slate-300 text-gray-600"
                        )}
                    >
                        <div className='flex flex-col gap-y-2 items-center justify-center'>
                            <route.icon />
                            {route.title}
                        </div>
                    </div>
                )
            }
            <div className='p-2 w-full hover:bg-slate text-gray-600 hover:text-gray-800'>

            </div>
            <div className='p-2 w-full hover:bg-slate-300 flex flex-col gap-y-2 items-center justify-center
            text-gray-600 hover:text-gray-800'>
                <UserButton />
                {user?.firstName}
            </div>
            <Button variant="pro" className='flex items-center justify-between gap-x-2'>
                Pro
                <Zap fill='text-gray-600 hover:text-gray-800' size={14} />
            </Button>
        </div>
    )
}

export default Sidebar