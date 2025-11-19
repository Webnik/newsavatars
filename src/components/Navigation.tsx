"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import { Menu, X, Newspaper, User, LogOut, Settings } from "lucide-react"

export function Navigation() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Newspaper className="h-8 w-8 text-amber-400" />
            <span className="font-bold text-xl">
              News<span className="text-amber-400">Avatars</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-amber-400 transition">
              Home
            </Link>
            <Link href="/avatars" className="hover:text-amber-400 transition">
              Avatars
            </Link>
            <Link href="/categories" className="hover:text-amber-400 transition">
              Categories
            </Link>

            {session ? (
              <div className="flex items-center space-x-4">
                {session.user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-1 hover:text-amber-400 transition"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 hover:text-amber-400 transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center space-x-1 bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-md transition"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-800 px-4 py-4 space-y-3">
          <Link
            href="/"
            className="block hover:text-amber-400 transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/avatars"
            className="block hover:text-amber-400 transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Avatars
          </Link>
          <Link
            href="/categories"
            className="block hover:text-amber-400 transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Categories
          </Link>

          {session ? (
            <>
              {session.user.role === "admin" && (
                <Link
                  href="/admin"
                  className="block hover:text-amber-400 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="block hover:text-amber-400 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/auth/signin"
              className="block bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-md transition text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
