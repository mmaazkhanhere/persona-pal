"use client"
import React from 'react'

import { useToast } from '@/components/ui/use-toast'
import { useForm } from 'react-hook-form'
import * as z from "zod"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Pal name must be at least 2 characters"
    }),
    description: z.string().min(1, {
        message: 'Description for Pal is required'
    }),
    instructions: z.string().min(200, {
        message: 'Instructions requires at least 200 characters'
    }),
    seed: z.string().min(200, {
        message: "Example conversation requires more than 200 characters"
    }),
    src: z.string().min(1, {
        message: "Image is required"
    })
})

const Form = () => {
    const { toast } = useToast();
    return (
        <div>Form</div>
    )
}

export default Form