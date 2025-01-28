'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CardData } from '@/types/card'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Bookmark, Star, Calendar, User, Info, MessageSquare, Activity, History, ExternalLink, Pencil, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { bookmarkResourceById, deleteResourceById, fetchResourceById } from '@/services/api'
import { AccountData } from '@/types/account'
import { useAccount } from '@/hooks/useAccount'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { UpdateResourceModal } from "@/components/UpdateResourceModal"

export default function ResourcePage() {
  const params = useParams()
  const id = params.id as string
  const [resource, setResource] = useState<CardData | null>(null)
  const { account, isAuthenticated, loading, token } = useAccount()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [activeTab, setActiveTab] = useState('info')
  const [redirectCount, setRedirectCount] = useState(3)
  const router = useRouter()
  const [fetchCompleted, setFetchCompleted] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resourceData = await fetchResourceById(id, token)
        setResource(resourceData)
        if (resourceData?.isBookmarked) {
          setIsBookmarked(true)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setFetchCompleted(true)
      }
    }

    if (token)
      fetchData()
  }, [id, token])

  useEffect(() => {
    if (fetchCompleted && !resource) {
      const interval = setInterval(() => {
        setRedirectCount((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            router.back()
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [fetchCompleted, resource, router])

  const bookmarkHandle = () => {
    setIsBookmarked(!isBookmarked)

    bookmarkResourceById(id, token)
  }

  if (loading || !fetchCompleted) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
      </div>
    )
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-white text-center">
            404 - Resource Not Found. Redirecting to the previous screen in {redirectCount} seconds...
          </div>
        </div>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'activity':
        return (
          <div className="bg-[#1a2332] rounded-lg p-6">
            <div className="space-y-4">
              {resource.activity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-700">
                  <div className="flex items-center gap-2">
                    {activity.type === 'bookmark' && <Bookmark className="h-4 w-4 text-[#4cc38a]" />}
                    <span className="text-white">{activity.user}</span>
                    <span className="text-gray-400">{activity.type}d this resource</span>
                  </div>
                  <span className="text-sm text-gray-400">{activity.date}</span>
                </div>
              ))}
            </div>
          </div>
        )
      default:
        return (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <div className="bg-[#1a2332] rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-white mb-4">Description</h2>
                <p className="text-gray-300 leading-relaxed">{resource.description}</p>
              </div>

              <div className="bg-[#1a2332] rounded-lg p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-[#2d3c54] text-[#4cc38a] hover:bg-[#364761]"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div>


              <div className="col-span-1">
                <div className="bg-[#1a2332] rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Resource Stats</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Views</span>
                      <span className="text-white">
                        {resource.views}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6"></div>
              <div className="col-span-1">
                {account && resource.author === account.username && (
                  <div className="bg-[#1a2332] rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Manage Resource</h2>
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowUpdateModal(true)}
                        className="flex-1 bg-[#2d3c54] text-[#4cc38a] border-[#4cc38a] hover:bg-[#364761]"
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Update
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteModal(true)}
                        className="flex-1 bg-[#2d3c54] text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
    }
  }

  const handleUpdate = (updatedResource: Partial<CardData>) => {
    setResource((prev) => {
      if (!prev) return prev;
      return { ...prev, ...updatedResource };
    })
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    await deleteResourceById(resource.id, token)
    setIsDeleting(false)
    setShowDeleteModal(false)
    // After successful deletion, redirect to home page
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Resource Header */}
        <div className="flex items-start gap-6 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white">{resource.title}</h1>
              <Badge variant="secondary" className="bg-[#1a2332] text-[#4cc38a]">
                {resource.tags[0]}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {resource.author === account?.name ? (
                  <Link href="/account" className="hover:text-[#4cc38a]">
                    {resource.author}
                  </Link>
                ) : (
                  resource.author
                )}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {resource.dateCreated}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={bookmarkHandle}
              className={`${isBookmarked
                ? 'bg-[#1a2332] text-[#4cc38a] border-[#4cc38a]'
                : 'bg-[#1a2332] text-gray-400 border-gray-700'
                }`}
            >
              <Bookmark className="h-4 w-4 mr-2" />
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-[#4cc38a] hover:bg-[#3da671] text-white"
              onClick={() => { window.open(resource.url, '_blank') }}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Resource
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-800 mb-6">
          <nav className="flex gap-6">
            <button
              onClick={() => setActiveTab('info')}
              className={`pb-3 text-sm font-medium ${activeTab === 'info'
                ? 'text-[#4cc38a] border-b-2 border-[#4cc38a]'
                : 'text-gray-400 hover:text-gray-300'
                }`}
            >
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Resource Info
              </div>
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`pb-3 text-sm font-medium ${activeTab === 'activity'
                ? 'text-[#4cc38a] border-b-2 border-[#4cc38a]'
                : 'text-gray-400 hover:text-gray-300'
                }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Activity
              </div>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        {renderTabContent()}
      </div>
      <UpdateResourceModal
        resource={resource}
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onUpdate={handleUpdate}
        token={token}
      />
      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent className="bg-[#1a2332] border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete your resource and remove the data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 text-white hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

