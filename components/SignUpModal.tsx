'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useAccount } from '@/hooks/useAccount'
import { signUp } from '@/services/api'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User } from 'lucide-react'
import Image from 'next/image'

interface SignUpModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenSignIn: () => void
}

export function SignUpModal({ isOpen, onClose, onOpenSignIn }: SignUpModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const { updateAccount } = useAccount()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const { accountData, token } = await signUp(email, password)
      updateAccount(accountData, token)
      onClose()
      window.location.reload()
    } catch (error) {
      console.error('Error signing up:', error)
      setError('An error occurred during sign up. Please try again.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#1a2332] text-white border-gray-700">
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle className="text-2xl font-bold text-center">Create your Shalo account</DialogTitle>
          <DialogDescription className="text-gray-400 text-center">
            Join the community of developers sharing and discovering resources.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#2d3748] border-gray-600 text-white pl-10 focus:border-[#4cc38a] focus:ring-[#4cc38a]"
                placeholder="John Doe"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#2d3748] border-gray-600 text-white pl-10 focus:border-[#4cc38a] focus:ring-[#4cc38a]"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#2d3748] border-gray-600 text-white pl-10 focus:border-[#4cc38a] focus:ring-[#4cc38a]"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full bg-[#4cc38a] hover:bg-[#3da671] text-white">
            Sign Up
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <button onClick={() => { onClose(); onOpenSignIn(); }} className="text-[#4cc38a] hover:underline font-semibold">
            Sign in
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

