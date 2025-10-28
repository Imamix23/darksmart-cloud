import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Logo/Branding */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-white mb-2">DarkSmart</h1>
            <p className="text-xl text-slate-300">Cloud Platform for Smart Home Control</p>
          </div>

          {/* Hero Card */}
          <Card className="bg-slate-800 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Welcome to DarkSmart</CardTitle>
              <CardDescription className="text-slate-300">
                Control your smart home devices from anywhere with our secure cloud platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">
                Manage your devices, create automations, and integrate with Google Home all in one place.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/auth/login">
                  <Button className="bg-blue-600 hover:bg-blue-700">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700 bg-transparent">
                    Create Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Secure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm">Enterprise-grade security with OAuth2 and JWT tokens</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Connected</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm">Seamless Google Home integration for voice control</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Reliable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm">Real-time device state synchronization and monitoring</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
