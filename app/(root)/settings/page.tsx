"use client"

import { Button } from '@/components/ui/button';
import { checkSubscription } from '@/lib/subscription';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import PlusButton from '../components/plus-button';

const Settings = () => {
    const [isPro, setIsPro] = useState(false);

    useEffect(() => {
        // Fetch subscription status asynchronously when the component mounts
        async function fetchSubscriptionStatus() {
            const isPro = await checkSubscription();
            setIsPro(isPro);
        }

        fetchSubscriptionStatus();
    }, []);

    const handleButton = async () => {
        try {
            const res = await axios.get("/api/stripe");
            window.location.href = res.data.url;
        } catch (error) {
            console.log("SUBSCRIPTION_BUTTON_ERROR", error);
        }
    };

    return (
        <div className='flex flex-col items-start justify-center gap-2 text-sm'>
            <h2 className='text-xl font-semibold'>Settings</h2>
            {isPro ? "You are currently on Plus plan" : "You are currently on the free plan"}
            <PlusButton isPro={isPro} />
        </div>
    );
};

export default Settings;
