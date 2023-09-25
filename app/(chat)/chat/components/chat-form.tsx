import React from 'react'
import { ChatRequestOptions } from "ai"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizonal } from 'lucide-react';

type Props = {
    input: string;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
    //Either will be an input element or textarea element for entering text
    onSubmit: (event: React.FormEvent<HTMLFormElement>, chatRequestsOptions?: ChatRequestOptions | undefined) => void;
    //takes an form event parameter and an optional chatRequestOptions
    isLoading: boolean //loading state
}

const ChatForm = ({ input, handleInputChange, onSubmit, isLoading }: Props) => {
    return (
        <form
            className='flex items-center border-t border-primary/10 py-4 gap-x-2'
            onSubmit={onSubmit}
        >
            <Input
                disabled={isLoading}
                value={input}
                onChange={handleInputChange}
                placeholder='Send a new message'
                className='px-4 py-2 bg-primary/10 rounded-lg'
            />
            <Button disabled={isLoading} variant="ghost">
                <SendHorizonal />
            </Button>
        </form>
    )
}

export default ChatForm