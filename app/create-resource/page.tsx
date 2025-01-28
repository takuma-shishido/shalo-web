'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { createResource } from '@/services/api'
import { CardData } from '@/types/card'
import { AccountData } from '@/types/account'
import { ShaloCard } from '@/components/ShaloCard'
import { useAccount } from '@/hooks/useAccount'
import { Badge } from '@/components/ui/badge'

export default function CreateResourcePage() {
  const { account, isAuthenticated, token } = useAccount()
  const [formData, setFormData] = useState<Partial<CardData>>({
    title: '',
    description: '',
    tags: [],
    url: '',
    dateCreated: new Date().toISOString().split('T')[0],
    previewImage: '/placeholder.svg?height=200&width=400',
  })
  const [tagInput, setTagInput] = useState('')
  const [tagError, setTagError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (account) {
      setFormData(prev => ({ ...prev, author: account.name }))
    }
  }, [account])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'tags') {
      setTagInput(value)
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim().length === 0) {
      setTagError('Tags must be at least 1 character long')
      return
    }
    setFormData(prev => ({
      ...prev,
      tags: [...(prev.tags || []), tagInput.trim()]
    }))
    setTagInput('')
    setTagError('')
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((formData.tags || []).length === 0) {
      setTagError('At least one tag is required')
      return
    }
    setIsSubmitting(true)

    try {
      const newResource = await createResource(formData as Omit<CardData, 'id'>, token)
      toast({
        title: 'Resource Created',
        description: 'Your new resource has been successfully created.',
      })
      router.push(`/resource/${newResource.id}`)
    } catch (error) {
      console.error('Error creating resource:', error)
      toast({
        title: 'Error',
        description: 'There was an error creating your resource. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">Create New Resource</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <form onSubmit={handleSubmit} className="space-y-6 bg-[#1a2332] p-6 rounded-lg flex-1">
            <div>
              <Label htmlFor="title" className="text-white">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="bg-gray-700 border-gray-600 text-white mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-white">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="bg-gray-700 border-gray-600 text-white mt-1"
                rows={4}
                required
              />
            </div>
            <div>
              <Label htmlFor="tags" className="text-white">Tags</Label>
              <div className="flex mt-1">
                <Input
                  id="tags"
                  name="tags"
                  value={tagInput}
                  onChange={handleInputChange}
                  className="bg-gray-700 border-gray-600 text-white flex-grow"
                  placeholder="Add a tag"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  className="ml-2 bg-[#4cc38a] hover:bg-[#3da671] text-white"
                >
                  Add
                </Button>
              </div>
              {tagError && <p className="text-red-500 text-sm mt-1">{tagError}</p>}
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags?.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-blue-600 text-white"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-white hover:text-red-300"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="url" className="text-white">Resource URL</Label>
              <Input
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                className="bg-gray-700 border-gray-600 text-white mt-1"
                type="url"
                required
              />
            </div>
            <Button
              type="submit"
              className="bg-[#4cc38a] hover:bg-[#3da671] text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Resource'}
            </Button>
          </form>

          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white mb-4">Preview</h2>
            <ShaloCard data={formData as CardData} isPreview={true} />
          </div>
        </div>
      </main>
    </div>
  )
}

