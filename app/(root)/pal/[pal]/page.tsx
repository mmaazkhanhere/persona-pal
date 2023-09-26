"use client"


import React from 'react'
import ImageUpload from './components/image-upload'
import { useForm } from 'react-hook-form'
import axios from "axios"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

import { BotIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'


const formSchema = z.object({
    name: z.string().min(2, {
        message: "Pal name must be at least 2 characters" //error message displayed for name of Pal
    }),
    description: z.string().min(1, {
        message: 'Description for Pal is required' //error message displayed for pal description
    }),
    instructions: z.string().min(200, {
        message: 'Instructions requires at least 200 characters' //error message for instruction
    }),
    seed: z.string().min(200, {
        message: "Example conversation requires more than 200 characters" //error message for seed
    }),
    src: z.string().min(1, {
        message: "Image is required" //error message for image 
    })
})

const instruction = `You are Cristiano Ronaldo. You are a world-famous footballer, known for your dedication, 
agility, and countless accolades in the football world. Your dedication to training and fitness is unmatched, 
and you have played for some of the world's top football clubs. Off the field, you're known for your charm, 
sharp fashion sense, and charitable work. Your passion for the sport is evident every time you step onto the pitch. 
You cherish the support of your fans and are driven by a relentless ambition to be the best.`

const seed = `Human: Hi Cristiano, how's the day treating you?
Cristiano: *with a confident smile* Every day is a chance to train harder and aim higher. The pitch is my canvas, and the ball, my paintbrush. How about you?
Human: Not as exciting as your life, I bet!
Cristiano: *grinning* Everyone has their own pitch and goals. Just find yours and give it your all!`

const Bot = () => {

    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema), defaultValues: {
            name: "",
            description: "",
            instructions: "",
            seed: "",
            src: ""
        },
    });

    const isLoading = form.formState.isSubmitting; //loading state for the form

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        //code runs when the user clicks on Create Pal button
        try {
            await axios.post(`/api/pal`, values); //post the details to the api
            toast({
                variant: 'success',
                description: 'Pal Created' //toast message for successful creation
            });
            router.refresh();
            router.push('/');//to navigate back to the homepage
        } catch (error) {
            console.log("Error while creating Pal", error);
            toast({
                variant: "destructive",
                description: "Oops! Something went wrong"
            });
        }
    }

    return (
        <div className='h-full max-w-3xl mx-auto p-4'>
            <Form {...form}>
                <form
                    className='space-y-6 pb-10'
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <div className='space-y-2 w-full'>
                        <h3 className='text-xl font-medium'>
                            Lets Create Your Personal Pal
                        </h3>
                        <p className='text-sm text-muted-foreground/60'>
                            General information about your PersonalPal
                        </p>
                        <Separator />
                    </div>
                    <FormField
                        name='src'
                        render={({ field }) => (
                            <FormItem className='flex flex-col items-center justify-center'>
                                <FormControl>
                                    <ImageUpload
                                        disabled={isLoading}
                                        url={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage className='text-sm' />
                            </FormItem>
                        )}
                    />
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <FormField
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='font-medium'>Pal Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            placeholder='Christiano Ronaldo'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className='text-sm' />
                                    <FormDescription className='text-xs text-primary/60'>
                                        What your Pal will be called
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pal Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            placeholder='One of Greatest Footballer of All Time'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className='text-sm' />
                                    <FormDescription className='text-xs text-primary/60'>
                                        How you describe your Pal?
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='grid grid-cols-1'>
                        <FormField
                            name="instructions"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Instrucitons for Pal</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            disabled={isLoading}
                                            placeholder={instruction}
                                            rows={7}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className='text-sm' />
                                    <FormDescription className='text-xs text-primary/60'>
                                        Describe in detail about your Pal. The more detailed your description, the better Pal response will be.
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='grid grid-cols-1'>
                        <FormField
                            name="seed"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Conversation Example</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            disabled={isLoading}
                                            placeholder={seed}
                                            rows={7}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className='text-sm' />
                                    <FormDescription className='text-xs text-primary/60'>
                                        Write an example conversation for your Pal showing how it should response. More conversation, better will
                                        be the Pal response
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='w-full flex justify-center items-center gap-2'>
                        <Button size="lg" variant="pro">
                            Create Pal
                            <BotIcon size={18} className='ml-2' />
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default Bot