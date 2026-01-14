'use server'

import { getSession } from '@/lib/get-session'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getAvailableCourses() {
  const session = await getSession()
  
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  // Get all courses with instructor info and enrollment count
  const courses = await prisma.course.findMany({
    include: {
      instructor: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          enrollments: true,
          modules: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return courses
}

export async function getEnrolledCourses() {
  const session = await getSession()
  
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      course: {
        include: {
          instructor: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              modules: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return enrollments.map(enrollment => enrollment.course)
}

export async function enrollInCourse(courseId: string) {
  const session = await getSession()
  
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  // Check if already enrolled
  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId,
      },
    },
  })

  if (existingEnrollment) {
    throw new Error('You are already enrolled in this course')
  }

  // Check if course exists
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  })

  if (!course) {
    throw new Error('Course not found')
  }

  const enrollment = await prisma.enrollment.create({
    data: {
      userId: session.user.id,
      courseId,
    },
  })

  revalidatePath('/student/courses')
  revalidatePath('/student/enrolled')
  return enrollment
}

export async function getCourseContent(courseId: string) {
  const session = await getSession()
  
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  // Check if student is enrolled
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId,
      },
    },
  })

  if (!enrollment) {
    throw new Error('You are not enrolled in this course')
  }

  // Get course with all modules, lessons, and quizzes
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      instructor: {
        select: {
          name: true,
          email: true,
        },
      },
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

  if (!course) {
    throw new Error('Course not found')
  }

  return course
}

