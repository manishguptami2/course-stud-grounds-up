import { redirect } from 'next/navigation'
import { getSession } from '@/lib/get-session'
import { getEnrolledCourses } from '@/app/actions/enrollment'
import { StudentNav } from '@/components/student-nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function StudentDashboardPage() {
  const session = await getSession()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  if (session.user.role !== 'STUDENT') {
    redirect('/')
  }

  const enrolledCourses = await getEnrolledCourses()

  return (
    <>
      <StudentNav />
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {session.user.name}
          </p>
        </div>

        <div className="flex gap-4 mb-8">
          <Link href="/student/courses">
            <Button>
              <BookOpen className="mr-2 h-4 w-4" />
              Browse All Courses
            </Button>
          </Link>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">My Enrolled Courses</h2>
          {enrolledCourses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No enrolled courses yet</h3>
                <p className="text-muted-foreground mb-4">
                  Browse available courses and enroll to get started
                </p>
                <Link href="/student/courses">
                  <Button>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Browse Courses
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {enrolledCourses.map((course) => (
                <Link key={course.id} href={`/student/courses/${course.id}`}>
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
                          <Users className="h-4 w-4" />
                          <span>{course.instructor.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{course._count.modules} Modules</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

