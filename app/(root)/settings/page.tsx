
import { checkSubscription } from '@/lib/subscription';
import React from 'react';
import PlusButton from '../components/plus-button';

const Settings = async () => {

    const isPro = await checkSubscription();

    return (
        <div className='flex flex-col items-start justify-center gap-2 text-sm'>
            <h2 className='text-xl font-semibold'>Settings</h2>
            {isPro ? "You are currently on Plus plan. You can create unlimited Pal"
                : "You are currently on the free plan. You can create only one Pal"}
            <PlusButton isPro={isPro} />
        </div>
    );
};

export default Settings;
