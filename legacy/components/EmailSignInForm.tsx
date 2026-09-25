'use client'

import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'

 

export default function EmailSignInForm() {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/'

    async function handleSubmit(event) {
        event.preventDefault()
        const formData = new FormData(event.target)
        const email = formData.get('email')
        signIn('resend', {email, callbackUrl})
    }

    return (
        <form onSubmit = {handleSubmit}>
            <div className='space-y-2'>
              <input
                    className="w-full px-3 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm text-black focus:outline-none focus:border-gray-400 focus:bg-white"
                    id = 'email'
                    name = 'email'
                    type = 'email'
                  
                    placeholder = 'Email'
                    autoComplete = 'email'
                    required
                    />
            </div>
            <button
            type = 'submit'
        
            color = 'gray'
            className = 'mt-3 w-full'
            >
                Register
            </button>
        </form>
    )
}