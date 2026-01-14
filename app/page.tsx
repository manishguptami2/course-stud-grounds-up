import { redirect } from 'next/navigation'
import { getSession } from '@/lib/get-session'

export default async function Home() {
  try {
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
  } catch (error) {
    console.error('Error in home page:', error)
    // If there's an error (e.g., database connection), redirect to signin
    redirect('/auth/signin')
  }
}

