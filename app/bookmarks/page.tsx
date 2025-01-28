'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { ShaloCard } from '@/components/ShaloCard'
import { CardData } from '@/types/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Bookmark } from 'lucide-react'
import { useAccount } from '@/hooks/useAccount'
import { fetchBookmarks } from '@/services/api'

export default function BookmarksPage() {
  const { token, loading, isAuthenticated } = useAccount()
  const [bookmarks, setBookmarks] = useState<CardData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchLoading, setSearchLoading] = useState(false)
  const cardsPerPage = 6
  const totalPages = Math.ceil(bookmarks.length / cardsPerPage)

  const indexOfLastCard = currentPage * cardsPerPage
  const indexOfFirstCard = indexOfLastCard - cardsPerPage
  const currentCards = bookmarks.slice(indexOfFirstCard, indexOfLastCard)

  const handleSearchResults = (results: CardData[]) => {
    setBookmarks(results)
    setCurrentPage(1) // 検索結果が表示されるようにページをリセット
    setSearchLoading(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookmarksData = await fetchBookmarks(token)
        console.log(bookmarksData)
        setBookmarks(bookmarksData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setSearchLoading(false)
      }
    }

    if (token) {
      fetchData()
    }
  }, [token])

  if (loading || searchLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header isFakeButton={true} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Bookmark className="mr-2 h-8 w-8 text-[#4cc38a]" />
              My Bookmarks
            </h1>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Bookmark className="mr-2 h-8 w-8 text-[#4cc38a]" />
            My Bookmarks
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentCards.map((card) => (
            <ShaloCard data={card} key={card.id} />
          ))}
        </div>
        <div className="mt-8 flex justify-center items-center space-x-4">
          <span className="text-gray-400">
            {bookmarks.length} cards found
          </span>
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-[#1a2332]"
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
          <span className="text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-[#1a2332]"
          >
            Next <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </main>
    </div>
  )
}

