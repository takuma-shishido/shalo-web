import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Bookmark, Home, TrendingUpIcon as Trending, Star, PlusCircle, Compass, Award, HelpCircle } from 'lucide-react'

export function Sidebar() {
  return (
    <div className="w-64 bg-[#1a2332] text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Shalo</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="flex items-center space-x-2 text-gray-300 hover:text-[#4cc38a]">
                <Home className="h-5 w-5" />
                <span>Discover</span>
              </Link>
            </li>
            <li>
              <Link href="/trending" className="flex items-center space-x-2 text-gray-300 hover:text-[#4cc38a]">
                <Trending className="h-5 w-5" />
                <span>Trending</span>
              </Link>
            </li>
            <li>
              <Link href="/bookmarks" className="flex items-center space-x-2 text-gray-300 hover:text-[#4cc38a]">
                <Bookmark className="h-5 w-5" />
                <span>My Bookmarks</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

