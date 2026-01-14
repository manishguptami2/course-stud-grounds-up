'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createModule, updateModule, deleteModule } from '@/app/actions/module'
import { createLesson, updateLesson, deleteLesson } from '@/app/actions/lesson'
import { createQuiz, createQuestion, deleteQuestion } from '@/app/actions/quiz'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Trash2, Edit, BookOpen, FileText, HelpCircle } from 'lucide-react'
import { MarkdownEditor } from '@/components/markdown-editor'

type Course = {
  id: string
  title: string
  description: string | null
  modules: Array<{
    id: string
    title: string
    order: number
    lessons: Array<{
      id: string
      title: string
      content: string
      order: number
      quiz: {
        id: string
        title: string
        questions: Array<{
          id: string
          text: string
          options: string
          correctAnswer: number
        }>
      } | null
    }>
  }>
}

export function CourseEditor({ course }: { course: Course }) {
  const router = useRouter()
  const [activeModule, setActiveModule] = useState<string | null>(null)
  const [activeLesson, setActiveLesson] = useState<string | null>(null)
  const [lessonContent, setLessonContent] = useState<string>('')
  const [editingLessonContent, setEditingLessonContent] = useState<Record<string, string>>({})

  const handleCreateModule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const order = course.modules.length
    formData.append('order', order.toString())
    
    try {
      await createModule(course.id, formData)
      form.reset()
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create module')
    }
  }

  const handleUpdateModule = async (moduleId: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    
    try {
      await updateModule(moduleId, formData)
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update module')
    }
  }

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module? All lessons will be deleted.')) {
      return
    }
    try {
      await deleteModule(moduleId)
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete module')
    }
  }

  const handleCreateLesson = async (moduleId: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const module = course.modules.find(m => m.id === moduleId)
    const order = module?.lessons.length || 0
    formData.append('order', order.toString())
    formData.append('content', lessonContent)
    
    try {
      await createLesson(moduleId, formData)
      setLessonContent('')
      form.reset()
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create lesson')
    }
  }

  const handleUpdateLesson = async (lessonId: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    try {
      await updateLesson(lessonId, formData)
      router.refresh()
      setActiveLesson(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update lesson')
    }
  }

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) {
      return
    }
    try {
      await deleteLesson(lessonId)
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete lesson')
    }
  }

  const handleCreateQuiz = async (lessonId: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    try {
      await createQuiz(lessonId, formData)
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create quiz')
    }
  }

  const handleCreateQuestion = async (quizId: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    
    // Collect options
    const options: string[] = []
    for (let i = 0; i < 4; i++) {
      const option = formData.get(`option${i}`) as string
      if (option) options.push(option)
    }
    
    if (options.length < 2) {
      alert('Please provide at least 2 options')
      return
    }
    
    formData.append('options', JSON.stringify(options))
    
    try {
      await createQuestion(quizId, formData)
      form.reset()
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create question')
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) {
      return
    }
    try {
      await deleteQuestion(questionId)
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete question')
    }
  }

  return (
    <div className="space-y-6">
      {/* Create Module Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Module
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Module</DialogTitle>
            <DialogDescription>
              Add a new module to organize your course content
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateModule}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="module-title">Module Title *</Label>
                <Input
                  id="module-title"
                  name="title"
                  required
                  placeholder="e.g., Getting Started"
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Module</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modules List */}
      <div className="space-y-4">
        {course.modules.map((module) => (
          <Card key={module.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <CardTitle>{module.title}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Module
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Module</DialogTitle>
                        <DialogDescription>
                          Update module information
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => handleUpdateModule(module.id, e)}>
                        <div className="space-y-4 py-4">
                          <div>
                            <Label htmlFor="edit-module-title">Module Title *</Label>
                            <Input
                              id="edit-module-title"
                              name="title"
                              defaultValue={module.title}
                              required
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Update Module</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Lesson
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create New Lesson</DialogTitle>
                        <DialogDescription>
                          Add a new lesson to {module.title}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => handleCreateLesson(module.id, e)}>
                        <div className="space-y-4 py-4">
                          <div>
                            <Label htmlFor="lesson-title">Lesson Title *</Label>
                            <Input
                              id="lesson-title"
                              name="title"
                              required
                              placeholder="e.g., Introduction to HTML"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="lesson-content">Content (Markdown)</Label>
                            <div className="mt-1">
                              <MarkdownEditor
                                value={lessonContent}
                                onChange={(val) => setLessonContent(val || '')}
                                placeholder="Write your lesson content in Markdown format..."
                              />
                              <input
                                type="hidden"
                                name="content"
                                value={lessonContent}
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Create Lesson</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteModule(module.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {module.lessons.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No lessons yet</p>
                ) : (
                  module.lessons.map((lesson) => (
                    <Card key={lesson.id} className="bg-muted/50">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <CardTitle className="text-lg">{lesson.title}</CardTitle>
                          </div>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setActiveLesson(lesson.id)
                                    setEditingLessonContent({
                                      ...editingLessonContent,
                                      [lesson.id]: lesson.content
                                    })
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Edit Lesson</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={(e) => handleUpdateLesson(lesson.id, e)}>
                                  <div className="space-y-4 py-4">
                                    <div>
                                      <Label htmlFor="edit-lesson-title">Lesson Title *</Label>
                                      <Input
                                        id="edit-lesson-title"
                                        name="title"
                                        defaultValue={lesson.title}
                                        required
                                        className="mt-1"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-lesson-content">Content (Markdown)</Label>
                                      <div className="mt-1">
                                        <MarkdownEditor
                                          value={editingLessonContent[lesson.id] || lesson.content}
                                          onChange={(val) => setEditingLessonContent({
                                            ...editingLessonContent,
                                            [lesson.id]: val || ''
                                          })}
                                          placeholder="Write your lesson content in Markdown format..."
                                        />
                                        <input
                                          type="hidden"
                                          name="content"
                                          value={editingLessonContent[lesson.id] || lesson.content}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button type="submit">Update Lesson</Button>
                                  </DialogFooter>
                                </form>
                              </DialogContent>
                            </Dialog>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <HelpCircle className="mr-2 h-4 w-4" />
                                  {lesson.quiz ? 'Edit Quiz' : 'Add Quiz'}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>
                                    {lesson.quiz ? 'Edit Quiz' : 'Create Quiz'}
                                  </DialogTitle>
                                </DialogHeader>
                                {lesson.quiz ? (
                                  <Tabs defaultValue="questions" className="w-full">
                                    <TabsList>
                                      <TabsTrigger value="questions">Questions</TabsTrigger>
                                      <TabsTrigger value="add">Add Question</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="questions" className="space-y-4">
                                      {lesson.quiz.questions.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No questions yet</p>
                                      ) : (
                                        lesson.quiz.questions.map((question, idx) => {
                                          const options = JSON.parse(question.options)
                                          return (
                                            <Card key={question.id}>
                                              <CardHeader>
                                                <div className="flex items-center justify-between">
                                                  <CardTitle className="text-base">
                                                    Question {idx + 1}
                                                  </CardTitle>
                                                  <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDeleteQuestion(question.id)}
                                                  >
                                                    <Trash2 className="h-4 w-4" />
                                                  </Button>
                                                </div>
                                              </CardHeader>
                                              <CardContent>
                                                <p className="mb-4">{question.text}</p>
                                                <div className="space-y-2">
                                                  {options.map((option: string, optIdx: number) => (
                                                    <div
                                                      key={optIdx}
                                                      className={`p-2 rounded ${
                                                        optIdx === question.correctAnswer
                                                          ? 'bg-green-100 dark:bg-green-900'
                                                          : 'bg-muted'
                                                      }`}
                                                    >
                                                      {optIdx === question.correctAnswer && '✓ '}
                                                      {option}
                                                    </div>
                                                  ))}
                                                </div>
                                              </CardContent>
                                            </Card>
                                          )
                                        })
                                      )}
                                    </TabsContent>
                                    <TabsContent value="add">
                                      <form onSubmit={(e) => handleCreateQuestion(lesson.quiz!.id, e)}>
                                        <div className="space-y-4">
                                          <div>
                                            <Label htmlFor="question-text">Question Text *</Label>
                                            <Textarea
                                              id="question-text"
                                              name="text"
                                              required
                                              placeholder="Enter your question..."
                                              className="mt-1"
                                            />
                                          </div>
                                          <div>
                                            <Label>Options *</Label>
                                            <div className="space-y-2 mt-2">
                                              {[0, 1, 2, 3].map((i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                  <Input
                                                    name={`option${i}`}
                                                    placeholder={`Option ${i + 1}`}
                                                    required={i < 2}
                                                  />
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                          <div>
                                            <Label htmlFor="correct-answer">Correct Answer Index *</Label>
                                            <Input
                                              id="correct-answer"
                                              name="correctAnswer"
                                              type="number"
                                              min="0"
                                              max="3"
                                              required
                                              placeholder="0, 1, 2, or 3"
                                              className="mt-1"
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">
                                              Enter the index (0-3) of the correct answer
                                            </p>
                                          </div>
                                          <Button type="submit">Add Question</Button>
                                        </div>
                                      </form>
                                    </TabsContent>
                                  </Tabs>
                                ) : (
                                  <form onSubmit={(e) => handleCreateQuiz(lesson.id, e)}>
                                    <div className="space-y-4">
                                      <div>
                                        <Label htmlFor="quiz-title">Quiz Title *</Label>
                                        <Input
                                          id="quiz-title"
                                          name="title"
                                          required
                                          placeholder="e.g., Lesson 1 Quiz"
                                          className="mt-1"
                                        />
                                      </div>
                                      <Button type="submit">Create Quiz</Button>
                                    </div>
                                  </form>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteLesson(lesson.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground">
                          <p className="line-clamp-2">{lesson.content.substring(0, 100)}...</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

