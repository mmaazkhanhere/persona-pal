import React from 'react'
import { Ubuntu } from 'next/font/google'
import Link from 'next/link'

const ubuntu = Ubuntu({
    subsets: ['latin'],
    weight: '700'
})

const Navbar = () => {

    return (
        <nav className='w-full flex flex-grow items-center justify-center p-4'>
            <Link href="/" className='cursor-pointer'>
                <p className={`text-4xl font-bold ${ubuntu.className}`}>
                    <span className=' text-transparent bg-clip-text bg-gradient-to-r from-[#76cc81] to-[#b1eeb3]'>Persona</span>Pal
                </p>
            </Link>

        </nav>
    )
}

export default Navbar