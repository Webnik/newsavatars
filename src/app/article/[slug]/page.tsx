import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { PerspectiveCard } from "@/components/PerspectiveCard"
import { formatDistanceToNow } from "date-fns"
import { Clock, Tag, User, ArrowLeft } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function ArticlePage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true } },
      perspectives: {
        include: {
          avatar: true
        },
        orderBy: { createdAt: "asc" }
      }
    }
  })

  if (!article) {
    notFound()
  }

  const tags = JSON.parse(article.tags || "[]")

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center text-slate-600 hover:text-amber-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Home
      </Link>

      {/* Article Header */}
      <article className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        {/* Image */}
        {article.imageUrl && (
          <div className="aspect-video bg-slate-200">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 md:p-8">
          {/* Category */}
          <span className="inline-block bg-amber-500 text-white text-sm font-semibold px-3 py-1 rounded mb-4">
            {article.category}
          </span>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center text-sm text-slate-500 gap-4 mb-6">
            {article.author.name && (
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {article.author.name}
              </span>
            )}
            {article.publishedAt && (
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
              </span>
            )}
          </div>

          {/* Summary */}
          <p className="text-xl text-slate-600 mb-6 font-medium">
            {article.summary}
          </p>

          {/* Content */}
          <div className="prose prose-slate max-w-none">
            {article.content.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="h-4 w-4 text-slate-400" />
                {tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-slate-100 text-slate-600 text-sm px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Perspectives Section */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Avatar Perspectives
          <span className="text-slate-400 font-normal ml-2">
            ({article.perspectives.length})
          </span>
        </h2>

        {article.perspectives.length > 0 ? (
          <div className="space-y-6">
            {article.perspectives.map((perspective) => (
              <PerspectiveCard key={perspective.id} perspective={perspective} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-slate-600">
              No avatar perspectives yet. Check back soon!
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
