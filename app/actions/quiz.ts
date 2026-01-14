'use server'

import { getSession } from '@/lib/get-session'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createQuiz(lessonId: string, formData: FormData) {
  const session = await getSession()
  
  if (!session?.user || session.user.role !== 'INSTRUCTOR') {
    throw new Error('Unauthorized')
  }

  // Verify lesson ownership through module and course
  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      module: {
        course: {
          instructorId: session.user.id,
        },
      },
    },
    include: {
      module: true,
    },
  })

  if (!lesson) {
    throw new Error('Lesson not found')
  }

  const title = formData.get('title') as string

  if (!title) {
    throw new Error('Title is required')
  }

  const quiz = await prisma.quiz.create({
    data: {
      title,
      lessonId,
    },
  })

  revalidatePath(`/dashboard/courses/${lesson.module.courseId}`)
  return quiz
}

export async function createQuestion(quizId: string, formData: FormData) {
  const session = await getSession()
  
  if (!session?.user || session.user.role !== 'INSTRUCTOR') {
    throw new Error('Unauthorized')
  }

  // Verify quiz ownership through lesson, module, and course
  const quiz = await prisma.quiz.findFirst({
    where: {
      id: quizId,
      lesson: {
        module: {
          course: {
            instructorId: session.user.id,
          },
        },
      },
    },
    include: {
      lesson: {
        include: {
          module: true,
        },
      },
    },
  })

  if (!quiz) {
    throw new Error('Quiz not found')
  }

  const text = formData.get('text') as string
  const optionsJson = formData.get('options') as string
  const correctAnswer = parseInt(formData.get('correctAnswer') as string)

  if (!text || !optionsJson || isNaN(correctAnswer)) {
    throw new Error('All fields are required')
  }

  // Validate options is valid JSON array
  let options: string[]
  try {
    options = JSON.parse(optionsJson)
    if (!Array.isArray(options) || options.length < 2) {
      throw new Error('Options must be an array with at least 2 items')
    }
    if (correctAnswer < 0 || correctAnswer >= options.length) {
      throw new Error('Correct answer index is out of range')
    }
  } catch (e) {
    throw new Error('Invalid options format')
  }

  const question = await prisma.question.create({
    data: {
      text,
      options: optionsJson,
      correctAnswer,
      quizId,
    },
  })

  revalidatePath(`/dashboard/courses/${quiz.lesson.module.courseId}`)
  return question
}

export async function deleteQuestion(questionId: string) {
  const session = await getSession()
  
  if (!session?.user || session.user.role !== 'INSTRUCTOR') {
    throw new Error('Unauthorized')
  }

  const question = await prisma.question.findFirst({
    where: {
      id: questionId,
      quiz: {
        lesson: {
          module: {
            course: {
              instructorId: session.user.id,
            },
          },
        },
      },
    },
    include: {
      quiz: {
        include: {
          lesson: {
            include: {
              module: true,
            },
          },
        },
      },
    },
  })

  if (!question) {
    throw new Error('Question not found')
  }

  const courseId = question.quiz.lesson.module.courseId

  await prisma.question.delete({
    where: {
      id: questionId,
    },
  })

  revalidatePath(`/dashboard/courses/${courseId}`)
}

