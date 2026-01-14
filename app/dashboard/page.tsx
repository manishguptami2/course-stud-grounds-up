import { redirect } from 'next/navigation'
import { getSession } from '@/lib/get-session'
import { getInstructorCourses } from '@/app/actions/course'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, BookOpen, Users } from 'lucide-react'
import Link from 'next/link'
import { DashboardNav } from '@/components/dashboard-nav'

export default async function DashboardPage() {
  const session = await getSession()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  if (session.user.role !== 'INSTRUCTOR') {
    redirect('/')
  }

  const courses = await getInstructorCourses()

  return (
    <>
      <DashboardNav />
      <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {session.user.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/students">
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Manage Students
            </Button>
          </Link>
          <Link href="/dashboard/courses/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Course
            </Button>
          </Link>
        </div>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No courses yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first course
            </p>
            <Link href="/dashboard/courses/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Course
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link key={course.id} href={`/dashboard/courses/${course.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full overflow-hidden">
                {course.thumbnail && (
                  <div className="relative w-full h-48 overflow-hidden bg-muted">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.modules.length} Modules</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course._count.enrollments} Enrollments</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
      </div>
    </>
  )
}

