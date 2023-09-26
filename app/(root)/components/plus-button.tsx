"use client"

import { Button } from '@/components/ui/button'
import React from 'react'
import { useProModal } from '@/lib/use-pro-modal'

interface PlusButtonProps {
    isPro: boolean
}

const PlusButton = ({ isPro = false }: PlusButtonProps) => {

    const proModal = useProModal();

    return (

        <div>
            {
                isPro && <Button>
                    Manage Subscription
                </Button>
            }
            {
                !isPro && <Button variant="pro" onClick={proModal.onOpen}>
                    Subscribe to Plus
                </Button>
            }
        </div>

        // <Button
        //     variant='pro'
        //     onClick={onClick}
        // >
        //     {
        //         isPro ? "Manage Subscription" : "Upgrade to Plus"
        //     }
        // </Button>
    )
}

export default PlusButton