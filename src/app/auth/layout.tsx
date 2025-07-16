import { AuthProvider } from '../../lib/contexts/auth-context'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {children}
      </div>
    </AuthProvider>
  )
}