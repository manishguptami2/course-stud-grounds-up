'use server'

import { getSession } from '@/lib/get-session'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createLesson(moduleId: string, formData: FormData) {
  const session = await getSession()
  
  if (!session?.user || session.user.role !== 'INSTRUCTOR') {
    throw new Error('Unauthorized')
  }

  // Verify module ownership through course
  const module = await prisma.module.findFirst({
    where: {
      id: moduleId,
      course: {
        instructorId: session.user.id,
      },
    },
  })

  if (!module) {
    throw new Error('Module not found')
  }

  const title = formData.get('title') as string
  const content = formData.get('content') as string || ''
  const order = parseInt(formData.get('order') as string) || 0

  if (!title) {
    throw new Error('Title is required')
  }

  const lesson = await prisma.lesson.create({
    data: {
      title,
      content,
      order,
      moduleId,
    },
  })

  revalidatePath(`/dashboard/courses/${module.courseId}`)
  return lesson
}

export async function updateLesson(lessonId: string, formData: FormData) {
  const session = await getSession()
  
  if (!session?.user || session.user.role !== 'INSTRUCTOR') {
    throw new Error('Unauthorized')
  }

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const order = formData.get('order') ? parseInt(formData.get('order') as string) : undefined

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

  const updatedLesson = await prisma.lesson.update({
    where: {
      id: lessonId,
    },
    data: {
      title: title || undefined,
      content: content !== null ? content : undefined,
      order: order !== undefined ? order : undefined,
    },
  })

  revalidatePath(`/dashboard/courses/${lesson.module.courseId}`)
  return updatedLesson
}

export async function deleteLesson(lessonId: string) {
  const session = await getSession()
  
  if (!session?.user || session.user.role !== 'INSTRUCTOR') {
    throw new Error('Unauthorized')
  }

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

  const courseId = lesson.module.courseId

  await prisma.lesson.delete({
    where: {
      id: lessonId,
    },
  })

  revalidatePath(`/dashboard/courses/${courseId}`)
}

