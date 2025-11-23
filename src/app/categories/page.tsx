import { prisma } from "@/lib/prisma"
import { ArticleCard } from "@/components/ArticleCard"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function CategoriesPage() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    include: {
      author: { select: { name: true } },
      perspectives: {
        include: {
          avatar: {
            select: { name: true, slug: true, imageUrl: true, title: true }
          }
        }
      }
    },
    orderBy: { publishedAt: "desc" }
  })

  // Group articles by category
  const categories = articles.reduce((acc: Record<string, typeof articles>, article: typeof articles[0]) => {
    if (!acc[article.category]) {
      acc[article.category] = []
    }
    acc[article.category].push(article)
    return acc
  }, {} as Record<string, typeof articles>)

  const categoryColors: Record<string, string> = {
    Technology: "bg-blue-500",
    Politics: "bg-red-500",
    Science: "bg-purple-500",
    Business: "bg-green-500",
    Entertainment: "bg-pink-500",
    Sports: "bg-orange-500",
    Health: "bg-teal-500",
    Environment: "bg-emerald-500",
    World: "bg-indigo-500"
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
        <p className="text-slate-600 mt-2">
          Browse articles by topic
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {Object.keys(categories).map((category) => (
          <a
            key={category}
            href={`#${category.toLowerCase()}`}
            className={`${categoryColors[category] || "bg-slate-500"} text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition`}
          >
            {category} ({categories[category].length})
          </a>
        ))}
      </div>

      {/* Articles by Category */}
      {Object.entries(categories).map(([category, categoryArticles]) => (
        <section key={category} id={category.toLowerCase()} className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
            <span
              className={`w-3 h-3 rounded-full mr-3 ${categoryColors[category] || "bg-slate-500"}`}
            />
            {category}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(categoryArticles as typeof articles).map((article: typeof articles[0]) => (
              <ArticleCard
                key={article.id}
                article={{
                  ...article,
                  publishedAt: article.publishedAt?.toISOString() || null
                }}
              />
            ))}
          </div>
        </section>
      ))}

      {Object.keys(categories).length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-slate-600">No articles available yet.</p>
        </div>
      )}
    </div>
  )
}
