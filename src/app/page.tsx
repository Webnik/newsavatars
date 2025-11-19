import { prisma } from "@/lib/prisma"
import { ArticleCard } from "@/components/ArticleCard"
import Link from "next/link"
import { ArrowRight, Sparkles, Users, Newspaper } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const featuredArticles = await prisma.article.findMany({
    where: { published: true, featured: true },
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
    orderBy: { publishedAt: "desc" },
    take: 1
  })

  const latestArticles = await prisma.article.findMany({
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
    orderBy: { publishedAt: "desc" },
    take: 6
  })

  const avatars = await prisma.avatar.findMany({
    where: { active: true },
    take: 6
  })

  const featured = featuredArticles[0]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              News Through <span className="text-amber-400">Every</span> Perspective
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Experience current events analyzed by AI avatars - from ancient philosophers
              to talking furniture, each offering their unique take on the news.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/avatars"
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition flex items-center"
              >
                <Users className="h-5 w-5 mr-2" />
                Meet the Avatars
              </Link>
              <Link
                href="#latest"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg transition flex items-center"
              >
                <Newspaper className="h-5 w-5 mr-2" />
                Read Stories
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12 max-w-2xl mx-auto text-center">
            <div>
              <p className="text-3xl font-bold text-amber-400">{latestArticles.length}+</p>
              <p className="text-sm text-slate-400">Articles</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-400">{avatars.length}+</p>
              <p className="text-sm text-slate-400">Avatars</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-400">∞</p>
              <p className="text-sm text-slate-400">Perspectives</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featured && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <ArticleCard
            article={{
              ...featured,
              publishedAt: featured.publishedAt?.toISOString() || null
            }}
            featured
          />
        </section>
      )}

      {/* Latest Articles */}
      <section id="latest" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Latest Stories</h2>
          <Link
            href="/articles"
            className="text-amber-600 hover:text-amber-700 font-semibold flex items-center"
          >
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {latestArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={{
                  ...article,
                  publishedAt: article.publishedAt?.toISOString() || null
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Sparkles className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No Articles Yet
            </h3>
            <p className="text-slate-600">
              Check back soon for news with unique avatar perspectives!
            </p>
          </div>
        )}
      </section>

      {/* Featured Avatars */}
      {avatars.length > 0 && (
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Meet Our Avatars</h2>
              <Link
                href="/avatars"
                className="text-amber-600 hover:text-amber-700 font-semibold flex items-center"
              >
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {avatars.map((avatar) => (
                <Link
                  key={avatar.id}
                  href={`/avatar/${avatar.slug}`}
                  className="group text-center p-4 rounded-lg hover:bg-slate-50 transition"
                >
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                    {avatar.imageUrl ? (
                      <img
                        src={avatar.imageUrl}
                        alt={avatar.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-slate-400">
                        {avatar.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm text-slate-900 group-hover:text-amber-600 transition">
                    {avatar.name}
                  </h3>
                  <p className="text-xs text-slate-500 truncate">{avatar.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
