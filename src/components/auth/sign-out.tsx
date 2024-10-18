'use client'
import React from 'react'
import { Button } from '../ui/button'
import { logOut } from '@/services/auth/auth'

type Props = {
  children: React.ReactNode
}

export default function SignOutButton({ children }: Props) {
  return (
    <Button
      variant={'ghost'}
      onClick={() => {
        logOut()
      }}
    >
      {children}
    </Button>
  )
}
