import { redirect } from 'next/navigation'
import { getSession } from '@/lib/get-session'
import { getCourseById } from '@/app/actions/course'
import { CourseEditor } from '@/components/course-editor'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'

export default async function CourseEditorPage({
  params,
}: {
  params: { courseId: string }
}) {
  const session = await getSession()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  if (session.user.role !== 'INSTRUCTOR') {
    redirect('/')
  }

  const course = await getCourseById(params.courseId)

  if (!course) {
    redirect('/dashboard')
  }

  return (
    <>
      <DashboardNav />
      <div className="container mx-auto py-8">
      <Link href="/dashboard">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        {course.description && (
          <p className="text-muted-foreground mt-2">{course.description}</p>
        )}
      </div>

      <CourseEditor course={course} />
      </div>
    </>
  )
}

