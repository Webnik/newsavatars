import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export const dynamic = "force-dynamic"

export default async function AvatarPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const avatar = await prisma.avatar.findUnique({
    where: { slug },
    include: {
      perspectives: {
        include: {
          article: {
            select: {
              title: true,
              slug: true,
              summary: true,
              imageUrl: true,
              publishedAt: true,
              category: true
            }
          }
        },
        orderBy: { createdAt: "desc" }
      }
    }
  })

  if (!avatar) {
    notFound()
  }

  const personality = JSON.parse(avatar.personality || "[]")
  const quirks = JSON.parse(avatar.quirks || "[]")

  const categoryColors: Record<string, string> = {
    philosopher: "bg-purple-100 text-purple-700",
    historical: "bg-blue-100 text-blue-700",
    object: "bg-green-100 text-green-700",
    character: "bg-pink-100 text-pink-700",
    professional: "bg-amber-100 text-amber-700"
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link
        href="/avatars"
        className="inline-flex items-center text-slate-600 hover:text-amber-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Avatars
      </Link>

      {/* Avatar Profile */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar Image */}
            <div className="w-32 h-32 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
              {avatar.imageUrl ? (
                <img
                  src={avatar.imageUrl}
                  alt={avatar.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-5xl font-bold text-slate-400">
                  {avatar.name.charAt(0)}
                </span>
              )}
            </div>

            {/* Avatar Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-slate-900 mb-1">
                {avatar.name}
              </h1>
              <p className="text-lg text-slate-500 mb-3">{avatar.title}</p>
              <span
                className={`inline-block text-sm font-semibold px-3 py-1 rounded ${
                  categoryColors[avatar.category] || "bg-slate-100 text-slate-700"
                }`}
              >
                {avatar.category}
              </span>
              <p className="mt-4 text-slate-600">{avatar.description}</p>
            </div>
          </div>

          {/* Details */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {/* Personality */}
            {personality.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Personality Traits</h3>
                <div className="flex flex-wrap gap-2">
                  {personality.map((trait: string) => (
                    <span
                      key={trait}
                      className="bg-slate-100 text-slate-600 text-sm px-3 py-1 rounded-full"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Expertise */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Expertise</h3>
              <p className="text-slate-600 text-sm">{avatar.expertise}</p>
            </div>

            {/* Speaking Style */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Speaking Style</h3>
              <p className="text-slate-600 text-sm">{avatar.speakingStyle}</p>
            </div>

            {/* Quirks */}
            {quirks.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Quirks</h3>
                <ul className="text-slate-600 text-sm space-y-1">
                  {quirks.map((quirk: string) => (
                    <li key={quirk} className="flex items-start">
                      <span className="text-amber-500 mr-2">•</span>
                      {quirk}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Perspectives */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Recent Perspectives
          <span className="text-slate-400 font-normal ml-2">
            ({avatar.perspectives.length})
          </span>
        </h2>

        {avatar.perspectives.length > 0 ? (
          <div className="space-y-4">
            {avatar.perspectives.map((perspective) => (
              <Link
                key={perspective.id}
                href={`/article/${perspective.article.slug}`}
                className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="flex">
                  {perspective.article.imageUrl && (
                    <div className="w-32 h-32 flex-shrink-0">
                      <img
                        src={perspective.article.imageUrl}
                        alt={perspective.article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4 flex-1">
                    <span className="text-xs font-semibold text-amber-600">
                      {perspective.article.category}
                    </span>
                    <h3 className="font-bold text-slate-900 mt-1">
                      {perspective.headline}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      On: {perspective.article.title}
                    </p>
                    {perspective.article.publishedAt && (
                      <p className="text-xs text-slate-400 mt-2">
                        {formatDistanceToNow(new Date(perspective.article.publishedAt), {
                          addSuffix: true
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">
              {avatar.name} hasn&apos;t shared any perspectives yet.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
