"use client"

import React from 'react'
import { CldUploadButton } from "next-cloudinary"
import Image from 'next/image';

interface ImageUploadProps {
    url: string,
    onChange: (src: string) => void;
    disabled?: boolean
}

const ImageUpload = ({ url, onChange, disabled }: ImageUploadProps) => {

    return (
        <div className='w-full flex items-center justify-center'>
            <CldUploadButton
                onUpload={(result: any) => onChange(result.info.secure_url)}
                options={{
                    maxFiles: 1
                }}
                uploadPreset='h6oqaxku'
            >
                <div className='border-2 border-dashed border-muted-foreground p-4 
                rounded-lg opacity-100 hover:opacity-70 transition flex items-center justify-center'>

                    <div className='relative w-40 h-40'>
                        <Image
                            fill
                            src={url || "/avatar.svg"}
                            alt='Upload'
                            className='rounded-full object-cover'
                        />
                    </div>
                </div>

            </CldUploadButton>
        </div>
    )
}

export default ImageUpload