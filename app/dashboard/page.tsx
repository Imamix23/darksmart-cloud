// Dashboard page (protected)
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"

interface User {
  id: string
  email: string
  name: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const userData = localStorage.getItem("user")

        if (!token || !userData) {
          router.push("/auth/login")
          return
        }

        setUser(JSON.parse(userData))
      } catch (err) {
        setError("Failed to load user data")
        router.push("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="bg-red-900 border-red-700">
          <CardContent className="pt-6">
            <p className="text-red-200">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-300">Welcome back, {user?.name}!</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-slate-600 text-white hover:bg-slate-700 bg-transparent"
          >
            Sign Out
          </Button>
        </div>

        {/* User Info Card */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-slate-400 text-sm">Name</p>
              <p className="text-white font-medium">{user?.name}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Email</p>
              <p className="text-white font-medium">{user?.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700 opacity-50">
            <CardHeader>
              <CardTitle className="text-white">Devices</CardTitle>
              <CardDescription className="text-slate-400">Coming in Phase 3</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">Manage and control your smart home devices</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 opacity-50">
            <CardHeader>
              <CardTitle className="text-white">Rooms</CardTitle>
              <CardDescription className="text-slate-400">Coming in Phase 3</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">Organize devices by room</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 opacity-50">
            <CardHeader>
              <CardTitle className="text-white">Automations</CardTitle>
              <CardDescription className="text-slate-400">Coming in Phase 4</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">Create smart home routines and automations</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 opacity-50">
            <CardHeader>
              <CardTitle className="text-white">Google Home</CardTitle>
              <CardDescription className="text-slate-400">Coming in Phase 4</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">Connect and sync with Google Home</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
