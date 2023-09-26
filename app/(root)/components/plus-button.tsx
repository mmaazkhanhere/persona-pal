import { Button } from '@/components/ui/button'
import axios from 'axios'
import React from 'react'

interface PlusButtonProps {
    isPro: boolean
}

const PlusButton = ({ isPro = false }: PlusButtonProps) => {

    const onClick = async () => {
        /*function when the button is clicked on and is responsible for calling the stripe apo*/
        try {
            const response = await axios.get("/api/stripe"); //an GET http request is send to specified endpoint
            window.location.href = response.data.url; /*It is redirects the users browser to a new webpage specified
            by the url contained in the response.data object */

        } catch (error) {
            console.log("Error")
        }
    }

    return (
        <Button
            variant='pro'
            onClick={onClick}
        >
            {
                isPro ? "Manage Subscription" : "Upgrade to Plus"
            }
        </Button>
    )
}

export default PlusButton