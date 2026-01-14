import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/password'

const prisma = new PrismaClient()

async function main() {
  const email = 'manishgupta.sep10@gmail.com'
  const password = 'admin123'
  
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    console.log(`User with email ${email} already exists. Skipping creation.`)
    return
  }

  // Hash the password
  const hashedPassword = await hashPassword(password)

  // Create the instructor user
  const user = await prisma.user.create({
    data: {
      name: 'Manish Gupta',
      email,
      password: hashedPassword,
      role: 'INSTRUCTOR',
    },
  })

  console.log(`Created INSTRUCTOR user: ${user.email}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

