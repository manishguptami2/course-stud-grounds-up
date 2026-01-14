'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitQuizAttempt } from '@/app/actions/quiz-attempt'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HelpCircle, CheckCircle2, XCircle } from 'lucide-react'
import { Label } from '@/components/ui/label'

type Quiz = {
  id: string
  title: string
  questions: Array<{
    id: string
    text: string
    options: string
    correctAnswer: number
  }>
}

export function QuizViewer({
  quiz,
  lessonTitle,
  moduleTitle,
}: {
  quiz: Quiz
  lessonTitle: string
  moduleTitle: string
}) {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{
    score: number
    correctAnswers: number
    totalQuestions: number
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await submitQuizAttempt(quiz.id, answers)
      setResult(response)
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to submit quiz')
    } finally {
      setIsSubmitting(false)
    }
  }

  const questions = quiz.questions.map((q) => ({
    ...q,
    options: JSON.parse(q.options) as string[],
  }))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          <div>
            <CardTitle className="text-xl">{quiz.title}</CardTitle>
            <CardDescription>
              {lessonTitle} • {moduleTitle}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {result ? (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${
              result.score >= 70 
                ? 'bg-green-100 dark:bg-green-900' 
                : 'bg-yellow-100 dark:bg-yellow-900'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {result.score >= 70 ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                )}
                <h3 className="font-semibold text-lg">
                  Score: {result.score.toFixed(1)}%
                </h3>
              </div>
              <p className="text-sm">
                You got {result.correctAnswers} out of {result.totalQuestions} questions correct.
              </p>
            </div>
            <Button onClick={() => setResult(null)} variant="outline">
              Retake Quiz
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {questions.map((question, qIdx) => (
              <div key={question.id} className="space-y-3">
                <Label className="text-base font-semibold">
                  Question {qIdx + 1}: {question.text}
                </Label>
                <div className="space-y-2 pl-4">
                  {question.options.map((option, optIdx) => (
                    <label
                      key={optIdx}
                      className="flex items-center gap-2 p-2 rounded border cursor-pointer hover:bg-muted"
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={optIdx}
                        checked={answers[question.id] === optIdx}
                        onChange={() =>
                          setAnswers({ ...answers, [question.id]: optIdx })
                        }
                        className="cursor-pointer"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <Button
              type="submit"
              disabled={isSubmitting || Object.keys(answers).length !== questions.length}
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

