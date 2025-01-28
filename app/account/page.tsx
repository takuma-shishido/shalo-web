'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, MapPin, Link2, Github, Twitter, Trophy, Award, BookOpen } from 'lucide-react'
import { fetchBookmarks } from '@/services/api'
import { AccountData } from '@/types/account'
import { CardData } from '@/types/card'
import { ShaloCard } from '@/components/ShaloCard'
import Link from 'next/link'
import { useAccount } from '@/hooks/useAccount'

export default function AccountPage() {
  const { account, loading, token } = useAccount()
  // const [bookmarks, setBookmarks] = useState<CardData[]>([])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const bookmarksData = await fetchBookmarks(token)
  //       setBookmarks(bookmarksData)
  //     } catch (error) {
  //       console.error('Error fetching data:', error)
  //     }
  //   }

  //   fetchData()
  // }, [])

  if (loading || !account) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header isFakeButton={true} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-6">
            <Avatar className="w-16 h-16">
              <AvatarImage src={account.avatar} alt={account.name} />
              <AvatarFallback>{account.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">{account.username}</h1>
                <span className="text-gray-400">{account.memberNumber}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-2">
                <div className="flex items-center">
                  <CalendarDays className="w-4 h-4 mr-1" />
                  Joined {account.joinDate}
                </div>
                {account.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {account.location}
                  </div>
                )}
                {account.website && (
                  <div className="flex items-center">
                    <Link2 className="w-4 h-4 mr-1" />
                    <a href={account.website} target="_blank" rel="noopener noreferrer" className="text-[#4cc38a] hover:underline">
                      {account.website}
                    </a>
                  </div>
                )}
                {account.github && (
                  <div className="flex items-center">
                    <Github className="w-4 h-4 mr-1" />
                    <a href={`https://github.com/${account.github}`} target="_blank" rel="noopener noreferrer" className="text-[#4cc38a] hover:underline">
                      {account.github}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-[#1a2332] p-4 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="w-8 h-8 text-[#4cc38a]" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{account.contributions}</div>
                <div className="text-xs text-gray-400">CONTRIBUTIONS</div>
              </div>
            </div>
            <div className="bg-[#1a2332] p-4 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{account.bookmarks}</div>
                <div className="text-xs text-gray-400">BOOKMARKS</div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b border-gray-800 rounded-none p-0">
            <TabsTrigger
              value="overview"
              className="text-sm data-[state=active]:text-[#4cc38a] data-[state=active]:border-[#4cc38a] rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent"
            >
              OVERVIEW
            </TabsTrigger>
            {/* <TabsTrigger
              value="bookmarks"
              className="text-sm data-[state=active]:text-[#4cc38a] data-[state=active]:border-[#4cc38a] rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent"
            >
              BOOKMARKS
            </TabsTrigger> */}
          </TabsList>
          <TabsContent value="overview" className="mt-6">
            <div className="space-y-6">
              <div className="bg-[#1a2332] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">About</h3>
                <p className="text-gray-300">{account.bio}</p>
              </div>
              {/* Add more overview content here */}
            </div>
          </TabsContent>
          {/* <TabsContent value="bookmarks" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((bookmark) => (
                  <ShaloCard data={bookmark} key={bookmark.id} />
              ))}
            </div>
          </TabsContent> */}
        </Tabs>
      </main>
    </div>
  )
}

