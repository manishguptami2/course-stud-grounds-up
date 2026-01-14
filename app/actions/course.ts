'use server'

import { getSession } from '@/lib/get-session'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createCourse(formData: FormData) {
  const session = await getSession()
  
  if (!session?.user || session.user.role !== 'INSTRUCTOR') {
    throw new Error('Unauthorized')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const thumbnail = formData.get('thumbnail') as string | null

  if (!title || typeof title !== 'string') {
    throw new Error('Title is required')
  }

  // Ensure thumbnail is a valid string or null
  // Only use thumbnail if it's a non-empty string
  const thumbnailValue = (thumbnail && typeof thumbnail === 'string' && thumbnail.trim() !== '') 
    ? thumbnail.trim() 
    : null

  const course = await prisma.course.create({
    data: {
      title: title.trim(),
      description: description && typeof description === 'string' ? description.trim() || null : null,
      thumbnail: thumbnailValue,
      instructorId: session.user.id,
    },
  })

  revalidatePath('/dashboard')
  return course
}

export async function getInstructorCourses() {
  const session = await getSession()
  
  if (!session?.user || session.user.role !== 'INSTRUCTOR') {
    throw new Error('Unauthorized')
  }

  const courses = await prisma.course.findMany({
    where: {
      instructorId: session.user.id,
    },
    include: {
      modules: {
        include: {
          lessons: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
      _count: {
        select: {
          enrollments: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return courses
}

export async function getCourseById(courseId: string) {
  const session = await getSession()
  
  if (!session?.user || session.user.role !== 'INSTRUCTOR') {
    throw new Error('Unauthorized')
  }

  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      instructorId: session.user.id,
    },
    include: {
      modules: {
        include: {
          lessons: {
            include: {
              quiz: {
                include: {
                  questions: true,
                },
              },
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  })

  return course
}

export async function updateCourse(courseId: string, formData: FormData) {
  const session = await getSession()
  
  if (!session?.user || session.user.role !== 'INSTRUCTOR') {
    throw new Error('Unauthorized')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string

  const course = await prisma.course.update({
    where: {
      id: courseId,
      instructorId: session.user.id,
    },
    data: {
      title: title || undefined,
      description: description || null,
    },
  })

  revalidatePath(`/dashboard/courses/${courseId}`)
  return course
}

