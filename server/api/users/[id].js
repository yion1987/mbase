import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id)
  const method = event.node.req.method

  switch (method) {
    case 'GET':
      return await prisma.user.findUnique({
        where: { id },
        select: { id: true, username: true, roleId: true, role: { select: { name: true } } },
      })
    case 'PUT':
      const { username, password, roleId } = await readBody(event)
      const updateData = { username, roleId }
      if (password) {
        updateData.password = bcrypt.hashSync(password, 10)
      }
      return await prisma.user.update({
        where: { id },
        data: updateData,
        select: { id: true, username: true, roleId: true },
      })
    case 'DELETE':
      return await prisma.user.delete({
        where: { id },
      })
    default:
      throw createError({
        statusCode: 405,
        message: 'Method Not Allowed',
      })
  }
})