// Dashboard layout with navigation
"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      router.push("/auth/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-white">
            DarkSmart
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/devices">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                Devices
              </Button>
            </Link>
            <Link href="/dashboard/rooms">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                Rooms
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-700 bg-transparent"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Content */}
      {children}
    </div>
  )
}
