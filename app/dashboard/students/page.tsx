import { redirect } from 'next/navigation'
import { getSession } from '@/lib/get-session'
import { getStudents } from '@/app/actions/student'
import { StudentsTable } from '@/components/students-table'
import { DashboardNav } from '@/components/dashboard-nav'

export default async function StudentsPage() {
  const session = await getSession()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  if (session.user.role !== 'INSTRUCTOR') {
    redirect('/')
  }

  const students = await getStudents()

  return (
    <>
      <DashboardNav />
      <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Student Management</h1>
          <p className="text-muted-foreground mt-2">
            Add and manage student accounts
          </p>
        </div>
      </div>

      <StudentsTable students={students} />
      </div>
    </>
  )
}


