import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { PlusCircle, ArrowLeft, Pencil } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminAvatarsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    redirect("/auth/signin")
  }

  const avatars = await prisma.avatar.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { perspectives: true } }
    }
  })

  const categoryColors: Record<string, string> = {
    philosopher: "bg-purple-100 text-purple-700",
    historical: "bg-blue-100 text-blue-700",
    object: "bg-green-100 text-green-700",
    character: "bg-pink-100 text-pink-700",
    professional: "bg-amber-100 text-amber-700"
  }

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
        <h1 className="text-3xl font-bold text-slate-900">Avatars</h1>
        <Link
          href="/admin/avatars/new"
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-lg transition flex items-center"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          New Avatar
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {avatars.map((avatar) => (
          <div
            key={avatar.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
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
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">
                    {avatar.name}
                  </h3>
                  <p className="text-sm text-slate-500 truncate">{avatar.title}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    categoryColors[avatar.category] || "bg-slate-100 text-slate-600"
                  }`}
                >
                  {avatar.category}
                </span>
                <span className="text-sm text-slate-500">
                  {avatar._count.perspectives} perspectives
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    avatar.active
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {avatar.active ? "Active" : "Inactive"}
                </span>
                <Link
                  href={`/admin/avatars/${avatar.slug}`}
                  className="p-2 text-slate-400 hover:text-amber-600 transition"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {avatars.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-slate-500">
          No avatars yet. Create your first one!
        </div>
      )}
    </div>
  )
}
