import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { CardData } from "@/types/card"
import Link from "next/link"
import React from "react"

interface CardProps {
  data: Partial<CardData>;
  isPreview?: boolean;
}

export function ShaloCard({ data, isPreview = false }: CardProps) {
  const wrapperProps = isPreview ? { href: "" } : { href: data.id ? `/resource/${data.id}` : '#'}

  return (
    <Card className="w-full max-w-md overflow-hidden bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors flex flex-col justify-between">
      <Link {...wrapperProps}>
        <CardHeader className="p-0">
          <Image src={data.previewImage || "/placeholder.svg"} alt={data.title || 'Resource preview'} width={400} height={200} className="w-full h-48" />
        </CardHeader>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2 text-white">{data.title || 'Resource Title'}</h2>
          <p className="text-sm text-gray-400 mb-2">By {data.author || 'Author'} on {data.dateCreated || 'Date'}</p>
          <p className="text-sm text-gray-300 mb-4">{data.description || 'Resource description'}</p>
        </CardContent>
      </Link>
      <CardFooter className="px-4 py-2 bg-gray-700 flex flex-wrap gap-2">
        {data.tags && data.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="bg-blue-600 text-white">{tag}</Badge>
        ))}
      </CardFooter>
    </Card>
  )
}

