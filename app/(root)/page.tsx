import { UserButton, auth } from '@clerk/nextjs'
import React from 'react'
import prismadb from '@/lib/prismadb'
import Image from 'next/image'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquareIcon } from 'lucide-react'
import Link from 'next/link'

type Props = {}

const Home = async () => {

    const { user } = auth();

    const data = await prismadb.pal.findMany({
        where: {
            userId: user?.id
        },
        orderBy: {
            createdAt: 'desc'
        }
        ,
        include: {
            _count: {
                select: {
                    messages: true
                }
            }
        }
    });

    if (data.length == 0) {
        return (
            <div className='flex flex-col items-center justify-center gap-6 mt-10'>
                <Image
                    src="/bot.jpg"
                    alt='Logo for empty page'
                    className='grayscale'
                    width={500}
                    height={500}
                />
                <p className='text-2xl text-muted-foreground/80'>No pals created</p>
            </div>
        )
    }

    if (data.length > 0) {
        return (
            <div className='grid grid-cols md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 xl:gap-x-4
            mt-5 items-center'>
                {
                    data.map((pal) => (
                        <Card
                            key={pal.name}
                            className='hover:opacity-70 cursor-pointer border border-muted-foreground
                            p-2'
                        >
                            <Link href={`/chat/${pal.id}`}>
                                <CardHeader className='flex flex-col items-center justify-center gap-2'>
                                    <Image
                                        src={pal.src}
                                        alt="Pal Image"
                                        width={190}
                                        height={190}
                                    />
                                    <CardTitle className='md:text-lg xl:text-xl'>{pal.name}</CardTitle>
                                </CardHeader>
                                <CardFooter className='flex items-center justify-between'>
                                    <p className='text-muted-foreground md:text-sm xl:text-base'>@{pal.userName}</p>
                                    <div className='flex items-center justify-center gap-1 text-muted-foreground text-xs'>
                                        <MessageSquareIcon size={20} />
                                        {pal._count.messages}
                                    </div>
                                </CardFooter>
                            </Link>

                        </Card>
                    ))
                }
            </div>
        )
    }
}

export default Home