"use client"
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useProModal } from '@/lib/use-pro-modal'
import { DialogTitle } from '@radix-ui/react-dialog'
import axios from 'axios'
import React, { useState } from 'react'

type Props = {}

const ProModal = (props: Props) => {

    const proModal = useProModal();

    const [loading, setLoading] = useState(false);

    const onSubscribe = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/stripe");
            window.location.href = response.data.url;

        } catch (error) {
            console.log("[PRO_MODAL_POST_STRIPE_ERROR] ", error)
        }
    }

    return (
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='text-lg'>
                        Upgrade to Plus
                    </DialogTitle>
                    <DialogDescription className='text-sm'>
                        Create Custom<span className='text-green-400 mx-1 font-medium'>Pal</span>
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <div className='flex justify-between'>
                    <p className='text-2xl font-medium'>
                        $9 <span className='text-sm font-normal'>.99 /month</span>
                    </p>
                    <Button variant='pro' onClick={onSubscribe} disabled={loading}>
                        Subscribe
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ProModal