"use client"

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { UserButton, useUser } from '@clerk/nextjs'
import { MenuIcon, Plus, Settings } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { ModeToggle } from './mode-toggle'

type Props = {}

const MobileSidebar = (props: Props) => {

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
        <Sheet>
            <SheetTrigger>
                <Button variant="ghost">
                    <MenuIcon />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <div className='flex flex-col items-center justify-center gap-4'>
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
                    <div className='flex flex-col items-center justify-center'>
                        <ModeToggle />
                    </div>
                    <div className='flex flex-col items-center justify-center'>
                        <UserButton afterSignOutUrl='/sign-in' />
                        {user?.firstName}
                    </div>
                </div>

            </SheetContent>
        </Sheet>
    )
}

export default MobileSidebar