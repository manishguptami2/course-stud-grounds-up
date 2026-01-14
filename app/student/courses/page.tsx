import { redirect } from 'next/navigation'
import { getSession } from '@/lib/get-session'
import { getAvailableCourses, getEnrolledCourses } from '@/app/actions/enrollment'
import { StudentNav } from '@/components/student-nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Users, Check } from 'lucide-react'
import { EnrollButton } from '@/components/enroll-button'

export default async function CoursesCatalogPage() {
  const session = await getSession()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  if (session.user.role !== 'STUDENT') {
    redirect('/')
  }

  const [availableCourses, enrolledCourses] = await Promise.all([
    getAvailableCourses(),
    getEnrolledCourses(),
  ])

  const enrolledCourseIds = new Set(enrolledCourses.map(c => c.id))

  return (
    <>
      <StudentNav />
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Course Catalog</h1>
          <p className="text-muted-foreground mt-2">
            Browse and enroll in available courses
          </p>
        </div>

        {availableCourses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No courses available</h3>
              <p className="text-muted-foreground">
                Check back later for new courses
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {availableCourses.map((course) => {
              const isEnrolled = enrolledCourseIds.has(course.id)
              return (
                <Card key={course.id} className="hover:shadow-lg transition-shadow h-full flex flex-col overflow-hidden">
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
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>Instructor: {course.instructor.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span>{course._count.modules} Modules</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{course._count.enrollments} Students enrolled</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {isEnrolled ? (
                        <>
                          <Button asChild className="flex-1">
                            <a href={`/student/courses/${course.id}`}>
                              Continue Learning
                            </a>
                          </Button>
                          <Button variant="outline" size="icon" disabled>
                            <Check className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <EnrollButton courseId={course.id} />
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

