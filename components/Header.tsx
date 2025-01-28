'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Search, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { SignUpModal } from '@/components/SignUpModal'
import { SignInModal } from '@/components/SignInModal'
import Link from 'next/link'
import { fetchAllResources, searchResources } from '@/services/api'
import { useAccount } from '@/hooks/useAccount'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  isFakeButton?: boolean;
  onCardStyleChange?: (style: 'compact' | 'detailed') => void;
  onSearchResults?: (results: any[]) => void;
  showSearch?: boolean;
  loading?: boolean;
}

export function Header({ isFakeButton, onSearchResults, showSearch = false, loading = false }: HeaderProps) {
  const { account, isAuthenticated, clearAccount } = useAccount()
  const [localIsAuthenticated, setLocalIsAuthenticated] = useState(isAuthenticated)
  const [cardStyle, setCardStyle] = useState<'compact' | 'detailed'>('compact')
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false)
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setLocalIsAuthenticated(isAuthenticated)
  }, [isAuthenticated])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setSearchLoading(true)
    if (searchQuery.trim()) {
      try {
        const results = await searchResources(searchQuery)
        onSearchResults && onSearchResults(results)
      } catch (error) {
        console.error('Error searching resources:', error)
      } finally {
        setSearchLoading(false)
      }
    } else {
      try {
        const allResources = await fetchAllResources()
        onSearchResults && onSearchResults(allResources)
      } catch (error) {
        console.error('Error fetching all resources:', error)
      } finally {
        setSearchLoading(false)
      }
    }
  }

  const handleSignOut = () => {
    clearAccount()
    setLocalIsAuthenticated(false)
    
    window.location.pathname = '/'
    window.localStorage.reload()
  }

  return (
    <header className="bg-[#1a2332] border-b border-gray-700 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">Shalo</Link>
          {showSearch && (
            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search resources..."
                  className="pl-8 bg-[#0d1117] border-gray-600 text-white w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={searchLoading}
                />
              </div>
            </form>
          )}
          <div className="flex items-center space-x-4">
            {(localIsAuthenticated || isFakeButton) ? (
              <>
                <Link href="/create-resource">
                  <Button variant="default" className="bg-[#4cc38a] hover:bg-[#3da671] text-white" disabled={isFakeButton}>
                    Create Resource
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-gray-300 hover:text-white" disabled={isFakeButton}>
                      <User className="h-5 w-5 mr-2" />
                      Account
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#1a2332] border-gray-700">
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="text-gray-300 focus:bg-[#2d3c54] focus:text-white">
                        Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/settings" className="text-gray-300 focus:bg-[#2d3c54] focus:text-white">
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="" onClick={handleSignOut} className="text-gray-300 focus:bg-[#2d3c54] focus:text-white">
                        Sign Out
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="border-[#4cc38a] text-[#4cc38a] hover:bg-[#2d3c54]"
                  onClick={() => setIsSignInModalOpen(true)}
                  disabled={loading}
                >
                  Sign In
                </Button>
                <Button
                  variant="default"
                  className="bg-[#4cc38a] hover:bg-[#3da671] text-white"
                  onClick={() => setIsSignUpModalOpen(true)}
                  disabled={loading}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        onOpenSignIn={() => {
          setIsSignUpModalOpen(false);
          setIsSignInModalOpen(true);
        }}
      />
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onOpenSignUp={() => {
          setIsSignInModalOpen(false);
          setIsSignUpModalOpen(true);
        }}
      />
    </header>
  )
}

