'use server'

import { getSession } from '@/lib/get-session'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createModule(courseId: string, formData: FormData) {
  const session = await getSession()
  
  if (!session?.user || session.user.role !== 'INSTRUCTOR') {
    throw new Error('Unauthorized')
  }

  // Verify course ownership
  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      instructorId: session.user.id,
    },
  })

  if (!course) {
    throw new Error('Course not found')
  }

  const title = formData.get('title') as string
  const order = parseInt(formData.get('order') as string) || 0

  if (!title) {
    throw new Error('Title is required')
  }

  const module = await prisma.module.create({
    data: {
      title,
      order,
      courseId,
    },
  })

  revalidatePath(`/dashboard/courses/${courseId}`)
  return module
}

export async function updateModule(moduleId: string, formData: FormData) {
  const session = await getSession()
  
  if (!session?.user || session.user.role !== 'INSTRUCTOR') {
    throw new Error('Unauthorized')
  }

  const title = formData.get('title') as string
  const order = formData.get('order') ? parseInt(formData.get('order') as string) : undefined

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

  const updatedModule = await prisma.module.update({
    where: {
      id: moduleId,
    },
    data: {
      title: title || undefined,
      order: order !== undefined ? order : undefined,
    },
  })

  revalidatePath(`/dashboard/courses/${module.courseId}`)
  return updatedModule
}

export async function deleteModule(moduleId: string) {
  const session = await getSession()
  
  if (!session?.user || session.user.role !== 'INSTRUCTOR') {
    throw new Error('Unauthorized')
  }

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

  const courseId = module.courseId

  await prisma.module.delete({
    where: {
      id: moduleId,
    },
  })

  revalidatePath(`/dashboard/courses/${courseId}`)
}

