import { redirect } from 'next/navigation'
import { getSession } from '@/lib/get-session'

export default async function Home() {
  const session = await getSession()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  // Redirect based on role
  if (session.user.role === 'INSTRUCTOR') {
    redirect('/dashboard')
  } else if (session.user.role === 'STUDENT') {
    redirect('/student')
  }

  return null
}

