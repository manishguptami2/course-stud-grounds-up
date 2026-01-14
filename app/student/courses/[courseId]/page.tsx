import { redirect } from 'next/navigation'
import { getSession } from '@/lib/get-session'
import { getCourseContent } from '@/app/actions/enrollment'
import { StudentNav } from '@/components/student-nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, FileText, HelpCircle } from 'lucide-react'
import { LessonViewer } from '@/components/lesson-viewer'
import { QuizViewer } from '@/components/quiz-viewer'

export default async function CourseViewPage({
  params,
}: {
  params: { courseId: string }
}) {
  const session = await getSession()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  if (session.user.role !== 'STUDENT') {
    redirect('/')
  }

  let course
  try {
    course = await getCourseContent(params.courseId)
  } catch (error) {
    redirect('/student/courses')
  }

  return (
    <>
      <StudentNav />
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{course.title}</h1>
          {course.description && (
            <p className="text-muted-foreground mt-2">{course.description}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            Instructor: {course.instructor.name}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Course Content Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.modules.map((module) => (
                    <div key={module.id} className="space-y-2">
                      <div className="flex items-center gap-2 font-semibold text-sm">
                        <BookOpen className="h-4 w-4" />
                        <span>{module.title}</span>
                      </div>
                      <div className="pl-6 space-y-1">
                        {module.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <FileText className="h-3 w-3" />
                            <span>{lesson.title}</span>
                            {lesson.quiz && (
                              <HelpCircle className="h-3 w-3 ml-auto" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Tabs defaultValue={course.modules[0]?.lessons[0]?.id || 'empty'} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="lessons">Lessons</TabsTrigger>
                <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="lessons" className="space-y-4">
                {course.modules.map((module) => (
                  <div key={module.id} className="space-y-4">
                    {module.lessons.map((lesson) => (
                      <LessonViewer
                        key={lesson.id}
                        lesson={lesson}
                        moduleTitle={module.title}
                      />
                    ))}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="quizzes" className="space-y-4">
                {course.modules.map((module) =>
                  module.lessons
                    .filter((lesson) => lesson.quiz)
                    .map((lesson) => (
                      <QuizViewer
                        key={lesson.quiz!.id}
                        quiz={lesson.quiz!}
                        lessonTitle={lesson.title}
                        moduleTitle={module.title}
                      />
                    ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  )
}

