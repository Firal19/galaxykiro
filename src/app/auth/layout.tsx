import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication - GalaxyDreamTeam',
  description: 'Sign in or register to access your personalized development journey',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}