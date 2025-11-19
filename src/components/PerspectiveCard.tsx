import Link from "next/link"
import { ThumbsUp, ThumbsDown, Minus, Sparkles } from "lucide-react"

interface PerspectiveCardProps {
  perspective: {
    id: string
    headline: string
    content: string
    keyPoints: string
    sentiment: string
    avatar: {
      slug: string
      name: string
      title: string
      imageUrl: string | null
      category: string
    }
  }
}

export function PerspectiveCard({ perspective }: PerspectiveCardProps) {
  const keyPoints = JSON.parse(perspective.keyPoints || "[]")

  const sentimentIcon = {
    positive: <ThumbsUp className="h-4 w-4 text-green-500" />,
    negative: <ThumbsDown className="h-4 w-4 text-red-500" />,
    neutral: <Minus className="h-4 w-4 text-slate-400" />,
    mixed: <Sparkles className="h-4 w-4 text-amber-500" />
  }

  const sentimentLabel = {
    positive: "Positive",
    negative: "Negative",
    neutral: "Neutral",
    mixed: "Mixed"
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Avatar Header */}
      <div className="bg-slate-50 px-6 py-4 border-b flex items-center justify-between">
        <Link
          href={`/avatar/${perspective.avatar.slug}`}
          className="flex items-center space-x-3 group"
        >
          <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
            {perspective.avatar.imageUrl ? (
              <img
                src={perspective.avatar.imageUrl}
                alt={perspective.avatar.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-bold text-slate-400">
                {perspective.avatar.name.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition">
              {perspective.avatar.name}
            </h3>
            <p className="text-xs text-slate-500">{perspective.avatar.title}</p>
          </div>
        </Link>

        {/* Sentiment */}
        <div className="flex items-center space-x-1">
          {sentimentIcon[perspective.sentiment as keyof typeof sentimentIcon]}
          <span className="text-xs text-slate-500">
            {sentimentLabel[perspective.sentiment as keyof typeof sentimentLabel]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h4 className="text-xl font-bold text-slate-900 mb-4">
          {perspective.headline}
        </h4>

        <div className="prose prose-slate max-w-none text-slate-600 whitespace-pre-wrap">
          {perspective.content}
        </div>

        {/* Key Points */}
        {keyPoints.length > 0 && (
          <div className="mt-6 bg-slate-50 rounded-lg p-4">
            <h5 className="font-semibold text-sm text-slate-700 mb-2">
              Key Points:
            </h5>
            <ul className="space-y-1">
              {keyPoints.map((point: string, i: number) => (
                <li
                  key={i}
                  className="text-sm text-slate-600 flex items-start"
                >
                  <span className="text-amber-500 mr-2">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
