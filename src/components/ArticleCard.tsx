import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, Clock, Tag } from "lucide-react"

interface ArticleCardProps {
  article: {
    slug: string
    title: string
    summary: string
    imageUrl: string | null
    category: string
    publishedAt: string | null
    perspectives: Array<{
      avatar: {
        name: string
        slug: string
        imageUrl: string | null
        title: string
      }
    }>
  }
  featured?: boolean
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  return (
    <Link href={`/article/${article.slug}`}>
      <article
        className={`group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow ${
          featured ? "md:flex" : ""
        }`}
      >
        {/* Image */}
        <div
          className={`relative ${
            featured ? "md:w-1/2" : ""
          } aspect-video bg-slate-200`}
        >
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900">
              <span className="text-4xl font-bold text-white/20">NA</span>
            </div>
          )}
          <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded">
            {article.category}
          </span>
        </div>

        {/* Content */}
        <div className={`p-5 ${featured ? "md:w-1/2 md:flex md:flex-col md:justify-center" : ""}`}>
          <h3
            className={`font-bold text-slate-900 group-hover:text-amber-600 transition ${
              featured ? "text-2xl mb-3" : "text-lg mb-2"
            }`}
          >
            {article.title}
          </h3>

          <p className={`text-slate-600 ${featured ? "text-base mb-4" : "text-sm mb-3 line-clamp-2"}`}>
            {article.summary}
          </p>

          {/* Meta info */}
          <div className="flex items-center text-xs text-slate-500 space-x-4">
            {article.publishedAt && (
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
              </span>
            )}
            <span className="flex items-center">
              <MessageSquare className="h-3 w-3 mr-1" />
              {article.perspectives.length} perspectives
            </span>
          </div>

          {/* Avatar previews */}
          {article.perspectives.length > 0 && (
            <div className="mt-3 flex -space-x-2">
              {article.perspectives.slice(0, 5).map((p) => (
                <div
                  key={p.avatar.slug}
                  className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600"
                  title={p.avatar.name}
                >
                  {p.avatar.imageUrl ? (
                    <img
                      src={p.avatar.imageUrl}
                      alt={p.avatar.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    p.avatar.name.charAt(0)
                  )}
                </div>
              ))}
              {article.perspectives.length > 5 && (
                <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center text-xs font-bold text-amber-600">
                  +{article.perspectives.length - 5}
                </div>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
