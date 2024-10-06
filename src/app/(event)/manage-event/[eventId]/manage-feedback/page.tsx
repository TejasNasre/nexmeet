import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const ManageFeedbackForm = () => {
    return (
        <div className="w-full h-screen bg-black text-white text-6xl flex flex-col justify-center items-center">
            Feedback Statistics And Responses
            <Link href="manage-feedback/create">
                <Button
                    type="button"
                    className="w-full border border-white p-2 rounded-md bg-black text-white hover:bg-white hover:text-black"
                >
                    Create Form
                </Button>
            </Link>
        </div>
    )
}

export default ManageFeedbackForm