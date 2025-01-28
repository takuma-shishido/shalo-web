import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { CardData } from "@/types/card"
import { updateResourceById } from "@/services/api"

interface UpdateResourceModalProps {
  resource: CardData
  isOpen: boolean
  onClose: () => void
  onUpdate: (updatedResource: Partial<CardData>) => void
  token: string
}

export function UpdateResourceModal({ resource, isOpen, onClose, onUpdate, token }: UpdateResourceModalProps) {
  const [formData, setFormData] = useState<Partial<CardData>>({
    title: resource.title,
    description: resource.description,
    url: resource.url,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedResource = {
      ...formData,
    }

    updateResourceById(resource.id, updatedResource, token)
    onUpdate(updatedResource)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#1a2332] text-white border-gray-700">
        <DialogHeader>
          <DialogTitle>Update Resource</DialogTitle>
          <DialogDescription className="text-gray-400">
            Make changes to your resource here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="col-span-3 bg-[#2d3748] border-gray-600 text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3 bg-[#2d3748] border-gray-600 text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                URL
              </Label>
              <Input
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                className="col-span-3 bg-[#2d3748] border-gray-600 text-white"
                readOnly
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-[#4cc38a] hover:bg-[#3da671] text-white">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

