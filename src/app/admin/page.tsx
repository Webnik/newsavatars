import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Newspaper, Users, MessageSquare, PlusCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    redirect("/auth/signin")
  }

  const [articleCount, avatarCount, perspectiveCount] = await Promise.all([
    prisma.article.count(),
    prisma.avatar.count(),
    prisma.perspective.count()
  ])

  const recentArticles = await prisma.article.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { perspectives: true } }
    }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Newspaper className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-slate-500">Articles</p>
              <p className="text-2xl font-bold text-slate-900">{articleCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-slate-500">Avatars</p>
              <p className="text-2xl font-bold text-slate-900">{avatarCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-slate-500">Perspectives</p>
              <p className="text-2xl font-bold text-slate-900">{perspectiveCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Link
          href="/admin/articles/new"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition flex items-center"
        >
          <div className="p-3 bg-green-100 rounded-lg">
            <PlusCircle className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="font-semibold text-slate-900">Create Article</p>
            <p className="text-sm text-slate-500">Write a new news article</p>
          </div>
        </Link>

        <Link
          href="/admin/avatars/new"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition flex items-center"
        >
          <div className="p-3 bg-pink-100 rounded-lg">
            <PlusCircle className="h-6 w-6 text-pink-600" />
          </div>
          <div className="ml-4">
            <p className="font-semibold text-slate-900">Create Avatar</p>
            <p className="text-sm text-slate-500">Add a new AI persona</p>
          </div>
        </Link>
      </div>

      {/* Management Links */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Link
          href="/admin/articles"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
        >
          <h3 className="font-semibold text-slate-900 mb-2">Manage Articles</h3>
          <p className="text-sm text-slate-500">View and edit all articles</p>
        </Link>

        <Link
          href="/admin/avatars"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
        >
          <h3 className="font-semibold text-slate-900 mb-2">Manage Avatars</h3>
          <p className="text-sm text-slate-500">View and edit all avatars</p>
        </Link>
      </div>

      {/* Recent Articles */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-slate-900">Recent Articles</h2>
        </div>
        <div className="divide-y">
          {recentArticles.map((article: typeof recentArticles[0]) => (
            <Link
              key={article.id}
              href={`/admin/articles/${article.slug}`}
              className="block p-4 hover:bg-slate-50 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{article.title}</p>
                  <p className="text-sm text-slate-500">
                    {article.category} • {article._count.perspectives} perspectives
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    article.published
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {article.published ? "Published" : "Draft"}
                </span>
              </div>
            </Link>
          ))}
          {recentArticles.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No articles yet. Create your first one!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
