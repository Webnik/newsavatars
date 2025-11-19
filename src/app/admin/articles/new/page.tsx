"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Sparkles } from "lucide-react"

interface Avatar {
  id: string
  name: string
  title: string
}

export default function NewArticlePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [avatars, setAvatars] = useState<Avatar[]>([])
  const [selectedAvatars, setSelectedAvatars] = useState<string[]>([])

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    imageUrl: "",
    category: "Technology",
    tags: "",
    published: false,
    featured: false
  })

  useEffect(() => {
    fetch("/api/avatars")
      .then((res) => res.json())
      .then(setAvatars)
      .catch(console.error)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
        })
      })

      if (!res.ok) throw new Error("Failed to create article")

      const article = await res.json()

      // Generate perspectives if avatars are selected
      if (selectedAvatars.length > 0) {
        setGenerating(true)
        await fetch("/api/perspectives", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            articleId: article.id,
            avatarIds: selectedAvatars
          })
        })
      }

      router.push("/admin/articles")
      router.refresh()
    } catch (error) {
      console.error(error)
      alert("Failed to create article")
    } finally {
      setLoading(false)
      setGenerating(false)
    }
  }

  const categories = [
    "Technology",
    "Politics",
    "Science",
    "Business",
    "Entertainment",
    "Sports",
    "Health",
    "Environment",
    "World"
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/admin/articles"
        className="inline-flex items-center text-slate-600 hover:text-amber-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Articles
      </Link>

      <h1 className="text-3xl font-bold text-slate-900 mb-8">New Article</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Summary *
            </label>
            <textarea
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              rows={2}
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              rows={10}
              required
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="https://..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="AI, technology, future"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-slate-300 rounded"
              />
              <span className="ml-2 text-sm text-slate-700">Published</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-slate-300 rounded"
              />
              <span className="ml-2 text-sm text-slate-700">Featured</span>
            </label>
          </div>
        </div>

        {/* Avatar Selection */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
            Generate Avatar Perspectives
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Select avatars to automatically generate their perspectives on this article.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {avatars.map((avatar) => (
              <label
                key={avatar.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                  selectedAvatars.includes(avatar.id)
                    ? "border-amber-500 bg-amber-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedAvatars.includes(avatar.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedAvatars([...selectedAvatars, avatar.id])
                    } else {
                      setSelectedAvatars(selectedAvatars.filter((id) => id !== avatar.id))
                    }
                  }}
                  className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-slate-300 rounded"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-slate-900">{avatar.name}</p>
                  <p className="text-xs text-slate-500">{avatar.title}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || generating}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2 rounded-lg transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5 mr-2" />
            {generating ? "Generating perspectives..." : loading ? "Creating..." : "Create Article"}
          </button>
        </div>
      </form>
    </div>
  )
}
