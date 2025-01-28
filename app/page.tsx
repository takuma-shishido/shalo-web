'use client'

import { useState, useEffect } from 'react'
import { ShaloCard } from '@/components/ShaloCard'
import { CardData } from '@/types/card'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { fetchAllResources } from '@/services/api'
import { AccountData } from '@/types/account'
import { useAccount } from '@/hooks/useAccount'

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1)
  const [resources, setResources] = useState<CardData[]>([])
  const { isAuthenticated, loading } = useAccount()
  const [searchLoading, setSearchLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resourcesData = await fetchAllResources()
        setResources(resourcesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
      }
    }

    fetchData()
  }, [])

  const handleSearchResults = (results: CardData[]) => {
    setResources(results)
    setCurrentPage(1) // 検索結果が表示されるようにページをリセット
    setSearchLoading(false)
  }

  const cardsPerPage = 6
  const totalPages = Math.ceil(resources.length / cardsPerPage)
  const indexOfLastCard = currentPage * cardsPerPage
  const indexOfFirstCard = indexOfLastCard - cardsPerPage
  const currentCards = resources.slice(indexOfFirstCard, indexOfLastCard)

  if (loading || searchLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header isFakeButton={true} onSearchResults={handleSearchResults} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header onSearchResults={handleSearchResults} showSearch={true} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">Discover Developer Resources</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentCards.map((card) => (
              <ShaloCard data={card} key={card.id} />
          ))}
        </div>
        <div className="mt-8 flex justify-center items-center space-x-4">
          <span className="text-gray-400">
            {resources.length} cards found
          </span>
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
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
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Next <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </main>
    </div>
  )
}

