// Devices management page
"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Device {
  id: string
  name: string
  type: string
  room?: string
  isOnline: boolean
  createdAt: string
}

export default function DevicesPage() {
  const router = useRouter()
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "action.devices.types.OUTLET",
    room: "",
  })

  useEffect(() => {
    fetchDevices()
  }, [])

  const fetchDevices = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        router.push("/auth/login")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050"}/api/devices`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Failed to fetch devices")

      const data = await response.json()
      setDevices(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load devices")
    } finally {
      setLoading(false)
    }
  }

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050"}/api/devices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          traits: [],
          attributes: {},
        }),
      })

      if (!response.ok) throw new Error("Failed to add device")

      setFormData({ name: "", type: "action.devices.types.OUTLET", room: "" })
      setShowForm(false)
      await fetchDevices()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add device")
    }
  }

  const handleDeleteDevice = async (deviceId: string) => {
    if (!confirm("Are you sure you want to delete this device?")) return

    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050"}/api/devices/${deviceId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (!response.ok) throw new Error("Failed to delete device")

      await fetchDevices()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete device")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Devices</h1>
            <p className="text-slate-300">Manage your smart home devices</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700">
            {showForm ? "Cancel" : "Add Device"}
          </Button>
        </div>

        {error && (
          <Alert className="bg-red-900 border-red-700 mb-6">
            <AlertDescription className="text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        {showForm && (
          <Card className="bg-slate-800 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Add New Device</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddDevice} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-200">
                    Device Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Living Room Light"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-slate-200">
                    Device Type
                  </Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
                  >
                    <option value="action.devices.types.OUTLET">Outlet</option>
                    <option value="action.devices.types.LIGHT">Light</option>
                    <option value="action.devices.types.THERMOSTAT">Thermostat</option>
                    <option value="action.devices.types.LOCK">Lock</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="room" className="text-slate-200">
                    Room (Optional)
                  </Label>
                  <Input
                    id="room"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    placeholder="Living Room"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Add Device
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {devices.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <p className="text-slate-300 text-center">No devices yet. Add your first device to get started!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map((device) => (
              <Card key={device.id} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">{device.name}</CardTitle>
                      <CardDescription className="text-slate-400">{device.type.split(".").pop()}</CardDescription>
                    </div>
                    <Badge className={device.isOnline ? "bg-green-600" : "bg-red-600"}>
                      {device.isOnline ? "Online" : "Offline"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {device.room && (
                    <div>
                      <p className="text-slate-400 text-sm">Room</p>
                      <p className="text-white">{device.room}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Link href={`/dashboard/devices/${device.id}`} className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full border-slate-600 text-white hover:bg-slate-700 bg-transparent"
                      >
                        Details
                      </Button>
                    </Link>
                    <Button onClick={() => handleDeleteDevice(device.id)} variant="destructive" className="flex-1">
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
