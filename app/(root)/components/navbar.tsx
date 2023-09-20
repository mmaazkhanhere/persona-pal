import React from 'react'
import { Home } from "lucide-react"
import Image from 'next/image'
import { Ubuntu } from 'next/font/google'

const ubuntu = Ubuntu({
    subsets: ['latin'],
    weight: '700'
})

const Navbar = () => {

    return (
        <nav className='w-full flex flex-grow items-center justify-center p-2'>
            <p className={`text-4xl font-bold ${ubuntu.className}`}>
                <span className=' text-transparent bg-clip-text bg-gradient-to-r from-[#76cc81] to-[#b1eeb3]'>Persona</span>Pal
            </p>
        </nav>
    )
}

export default Navbar