"use client"

import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { useProModal } from '@/lib/use-pro-modal'
import axios from 'axios'

interface PlusButtonProps {
    isPro: boolean
}

const PlusButton = ({ isPro = false }: PlusButtonProps) => {

    const proModal = useProModal();

    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/stripe")
            window.location.href = res.data.url;
        } catch (error) {
            console.log("[PLUS_BUTTON_SUBSCRIBE_ERROR]: ", error)
        }

    }

    return (

        <div>
            {
                isPro && <Button onClick={handleSubscribe} disabled={loading}>
                    Manage Subscription
                </Button>
            }
            {
                !isPro && <Button variant="pro" onClick={proModal.onOpen}>
                    Subscribe to Plus
                </Button>
            }
        </div>

    )
}

export default PlusButton