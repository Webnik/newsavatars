import Link from "next/link"
import { MessageSquare } from "lucide-react"

interface AvatarCardProps {
  avatar: {
    slug: string
    name: string
    title: string
    description: string
    imageUrl: string | null
    category: string
    _count?: {
      perspectives: number
    }
  }
}

export function AvatarCard({ avatar }: AvatarCardProps) {
  const categoryColors: Record<string, string> = {
    philosopher: "bg-purple-100 text-purple-700",
    historical: "bg-blue-100 text-blue-700",
    object: "bg-green-100 text-green-700",
    character: "bg-pink-100 text-pink-700",
    professional: "bg-amber-100 text-amber-700"
  }

  return (
    <Link href={`/avatar/${avatar.slug}`}>
      <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow p-6 text-center">
        {/* Avatar Image */}
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
          {avatar.imageUrl ? (
            <img
              src={avatar.imageUrl}
              alt={avatar.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl font-bold text-slate-400">
              {avatar.name.charAt(0)}
            </span>
          )}
        </div>

        {/* Name and Title */}
        <h3 className="font-bold text-lg text-slate-900 group-hover:text-amber-600 transition">
          {avatar.name}
        </h3>
        <p className="text-sm text-slate-500 mb-2">{avatar.title}</p>

        {/* Category Badge */}
        <span
          className={`inline-block text-xs font-semibold px-2 py-1 rounded ${
            categoryColors[avatar.category] || "bg-slate-100 text-slate-700"
          }`}
        >
          {avatar.category}
        </span>

        {/* Description */}
        <p className="mt-3 text-sm text-slate-600 line-clamp-2">
          {avatar.description}
        </p>

        {/* Perspectives count */}
        {avatar._count && (
          <div className="mt-4 flex items-center justify-center text-xs text-slate-500">
            <MessageSquare className="h-3 w-3 mr-1" />
            {avatar._count.perspectives} perspectives
          </div>
        )}
      </div>
    </Link>
  )
}
