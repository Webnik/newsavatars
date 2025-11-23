import { prisma } from "@/lib/prisma"
import { AvatarCard } from "@/components/AvatarCard"

export const dynamic = "force-dynamic"

export default async function AvatarsPage() {
  const avatars = await prisma.avatar.findMany({
    where: { active: true },
    include: {
      _count: {
        select: { perspectives: true }
      }
    },
    orderBy: { name: "asc" }
  })

  // Group avatars by category
  const categories = avatars.reduce((acc: Record<string, typeof avatars>, avatar: typeof avatars[0]) => {
    if (!acc[avatar.category]) {
      acc[avatar.category] = []
    }
    acc[avatar.category].push(avatar)
    return acc
  }, {} as Record<string, typeof avatars>)

  const categoryLabels: Record<string, string> = {
    philosopher: "Philosophers",
    historical: "Historical Figures",
    object: "Objects & Things",
    character: "Characters",
    professional: "Professionals"
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Meet the Avatars</h1>
        <p className="text-slate-600 mt-2">
          Our diverse cast of AI personalities, each bringing their unique perspective to the news.
        </p>
      </div>

      {Object.entries(categories).map(([category, categoryAvatars]) => (
        <section key={category} className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            {categoryLabels[category] || category}
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {(categoryAvatars as typeof avatars).map((avatar: typeof avatars[0]) => (
              <AvatarCard key={avatar.id} avatar={avatar} />
            ))}
          </div>
        </section>
      ))}

      {avatars.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-slate-600">No avatars available yet.</p>
        </div>
      )}
    </div>
  )
}
