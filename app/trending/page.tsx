'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { CardData } from '@/types/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, TrendingUp, Eye, ThumbsUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { fetchTrendingResources } from '@/services/api'
import { useAccount } from '@/hooks/useAccount'

export default function TrendingPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [trendingData, setTrendingData] = useState<CardData[]>([])
  const { isAuthenticated, loading } = useAccount()
  const [searchLoading, setSearchLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trendingResources = await fetchTrendingResources()
        setTrendingData(trendingResources)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const itemsPerPage = 5
  const totalPages = Math.ceil(trendingData.length / itemsPerPage)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = trendingData.slice(indexOfFirstItem, indexOfLastItem)

  if (loading || searchLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header isFakeButton={true} />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center">
              <TrendingUp className="mr-2 h-6 w-6 md:h-8 md:w-8 text-[#4cc38a]" />
              Trending Resources
            </h1>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center">
            <TrendingUp className="mr-2 h-6 w-6 md:h-8 md:w-8 text-[#4cc38a]" />
            Trending Resources
          </h1>
        </div>
        <div className="space-y-4 md:space-y-6">
          {currentItems.map((item, index) => (
            <Link href={`/resource/${item.id}`} key={item.id}>
              <div className="bg-[#1a2332] rounded-lg p-4 hover:bg-[#2d3c54] transition duration-200">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="text-xl md:text-2xl font-bold text-[#4cc38a] w-8 text-center">
                    {item.rank || index + 1 + indexOfFirstItem}
                  </div>
                  <div className="flex-shrink-0">
                    <Image src={item.previewImage || "/placeholder.svg"} alt={item.title} width={100} height={100} className="rounded-md w-full md:w-[100px] h-auto" />
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-lg md:text-xl font-semibold text-white mb-2">{item.title}</h2>
                    <p className="text-gray-400 text-sm mb-2">by {item.author}</p>
                    <p className="text-gray-300 text-sm mb-2 line-clamp-2">{item.description}</p>
                    <div className="flex flex-wrap gap-2 mb-2 md:mb-0">
                      {item.tags.map((tag) => (
                        <span key={tag} className="bg-[#2d3c54] text-[#4cc38a] px-2 py-1 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-2 w-full md:w-auto">
                    <div className="flex items-center text-gray-400">
                      <Eye className="w-4 h-4 mr-1" />
                      <span>{item.views?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
            className="w-full sm:w-auto border-gray-700 text-gray-300 hover:bg-[#1a2332]"
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
            className="w-full sm:w-auto border-gray-700 text-gray-300 hover:bg-[#1a2332]"
          >
            Next <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </main>
    </div>
  )
}

