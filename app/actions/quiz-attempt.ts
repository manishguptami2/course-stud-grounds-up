'use server'

import { getSession } from '@/lib/get-session'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function submitQuizAttempt(quizId: string, answers: Record<string, number>) {
  const session = await getSession()
  
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  // Get quiz with questions
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: true,
      lesson: {
        include: {
          module: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  })

  if (!quiz) {
    throw new Error('Quiz not found')
  }

  // Check if student is enrolled in the course
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: quiz.lesson.module.course.id,
      },
    },
  })

  if (!enrollment) {
    throw new Error('You are not enrolled in this course')
  }

  // Calculate score
  let correctAnswers = 0
  const totalQuestions = quiz.questions.length

  quiz.questions.forEach((question) => {
    const studentAnswer = answers[question.id]
    if (studentAnswer === question.correctAnswer) {
      correctAnswers++
    }
  })

  const score = (correctAnswers / totalQuestions) * 100

  // Create quiz attempt
  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: session.user.id,
      quizId,
      score,
    },
  })

  revalidatePath(`/student/courses/${quiz.lesson.module.course.id}`)
  return { attempt, score, correctAnswers, totalQuestions }
}

export async function getQuizAttempts(quizId: string) {
  const session = await getSession()
  
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const attempts = await prisma.quizAttempt.findMany({
    where: {
      userId: session.user.id,
      quizId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return attempts
}

