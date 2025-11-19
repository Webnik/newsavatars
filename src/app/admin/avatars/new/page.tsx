"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"

export default function NewAvatarPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    imageUrl: "",
    personality: "",
    speakingStyle: "",
    expertise: "",
    quirks: "",
    category: "philosopher",
    active: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/avatars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          personality: formData.personality.split(",").map((t) => t.trim()).filter(Boolean),
          quirks: formData.quirks.split(",").map((t) => t.trim()).filter(Boolean)
        })
      })

      if (!res.ok) throw new Error("Failed to create avatar")

      router.push("/admin/avatars")
      router.refresh()
    } catch (error) {
      console.error(error)
      alert("Failed to create avatar")
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { value: "philosopher", label: "Philosopher" },
    { value: "historical", label: "Historical Figure" },
    { value: "object", label: "Object" },
    { value: "character", label: "Character" },
    { value: "professional", label: "Professional" }
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/admin/avatars"
        className="inline-flex items-center text-slate-600 hover:text-amber-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Avatars
      </Link>

      <h1 className="text-3xl font-bold text-slate-900 mb-8">New Avatar</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="e.g., Socrates, A Chair, Kermit"
              required
            />
          </div>

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
              placeholder="e.g., Ancient Greek Philosopher, Office Furniture"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              rows={3}
              placeholder="Brief bio or description of the avatar..."
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
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Personality Traits */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Personality Traits (comma separated) *
            </label>
            <input
              type="text"
              value={formData.personality}
              onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="e.g., inquisitive, wise, ironic, humble"
              required
            />
          </div>

          {/* Speaking Style */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Speaking Style *
            </label>
            <textarea
              value={formData.speakingStyle}
              onChange={(e) => setFormData({ ...formData, speakingStyle: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              rows={2}
              placeholder="How does this avatar communicate? Formal, casual, questions, metaphors..."
              required
            />
          </div>

          {/* Expertise */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Expertise *
            </label>
            <textarea
              value={formData.expertise}
              onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              rows={2}
              placeholder="Areas of knowledge or specialization..."
              required
            />
          </div>

          {/* Quirks */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Quirks (comma separated)
            </label>
            <input
              type="text"
              value={formData.quirks}
              onChange={(e) => setFormData({ ...formData, quirks: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="e.g., always asks questions, makes chair puns"
            />
          </div>

          {/* Active */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-slate-300 rounded"
              />
              <span className="ml-2 text-sm text-slate-700">Active</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2 rounded-lg transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5 mr-2" />
            {loading ? "Creating..." : "Create Avatar"}
          </button>
        </div>
      </form>
    </div>
  )
}
