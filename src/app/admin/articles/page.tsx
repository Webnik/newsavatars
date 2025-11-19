import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { PlusCircle, ArrowLeft, Pencil, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export const dynamic = "force-dynamic"

export default async function AdminArticlesPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    redirect("/auth/signin")
  }

  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      _count: { select: { perspectives: true } }
    }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/admin"
        className="inline-flex items-center text-slate-600 hover:text-amber-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Dashboard
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Articles</h1>
        <Link
          href="/admin/articles/new"
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-lg transition flex items-center"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          New Article
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Perspectives
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-slate-900">{article.title}</p>
                    <p className="text-sm text-slate-500">{article.author.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600">{article.category}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      article.published
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {article.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600">
                    {article._count.perspectives}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-500">
                    {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      href={`/admin/articles/${article.slug}`}
                      className="p-2 text-slate-400 hover:text-amber-600 transition"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {articles.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No articles yet. Create your first one!
          </div>
        )}
      </div>
    </div>
  )
}
