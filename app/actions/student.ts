'use server'

import { getSession } from '@/lib/get-session'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/password'
import { revalidatePath } from 'next/cache'

export async function createStudent(formData: FormData) {
  const session = await getSession()
  
  if (!session?.user || session.user.role !== 'INSTRUCTOR') {
    throw new Error('Unauthorized')
  }

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required')
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error('A user with this email already exists')
  }

  // Hash the password
  const hashedPassword = await hashPassword(password)

  const student = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'STUDENT',
    },
  })

  revalidatePath('/dashboard/students')
  return student
}

export async function getStudents() {
  const session = await getSession()
  
  if (!session?.user || session.user.role !== 'INSTRUCTOR') {
    throw new Error('Unauthorized')
  }

  const students = await prisma.user.findMany({
    where: {
      role: 'STUDENT',
    },
    include: {
      _count: {
        select: {
          enrollments: true,
          quizAttempts: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return students
}

export async function updateStudent(studentId: string, formData: FormData) {
  const session = await getSession()
  
  if (!session?.user || session.user.role !== 'INSTRUCTOR') {
    throw new Error('Unauthorized')
  }

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!name || !email) {
    throw new Error('Name and email are required')
  }

  // Check if email is being changed and if it's already taken
  const existingUser = await prisma.user.findUnique({
    where: { id: studentId },
  })

  if (!existingUser) {
    throw new Error('Student not found')
  }

  if (existingUser.email !== email) {
    const emailTaken = await prisma.user.findUnique({
      where: { email },
    })
    if (emailTaken) {
      throw new Error('A user with this email already exists')
    }
  }

  const updateData: {
    name: string
    email: string
    password?: string
  } = {
    name,
    email,
  }

  // Only update password if provided
  if (password && password.trim() !== '') {
    updateData.password = await hashPassword(password)
  }

  const student = await prisma.user.update({
    where: {
      id: studentId,
      role: 'STUDENT',
    },
    data: updateData,
  })

  revalidatePath('/dashboard/students')
  return student
}

export async function deleteStudent(studentId: string) {
  const session = await getSession()
  
  if (!session?.user || session.user.role !== 'INSTRUCTOR') {
    throw new Error('Unauthorized')
  }

  await prisma.user.delete({
    where: {
      id: studentId,
      role: 'STUDENT',
    },
  })

  revalidatePath('/dashboard/students')
}


