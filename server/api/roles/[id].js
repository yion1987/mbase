import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id)
  const method = event.node.req.method

  switch (method) {
    case 'GET':
      return await prisma.role.findUnique({ where: { id } })
    case 'PUT':
      const { name } = await readBody(event)
      return await prisma.role.update({
        where: { id },
        data: { name },
      })
    case 'DELETE':
      return await prisma.role.delete({ where: { id } })
    default:
      throw createError({
        statusCode: 405,
        message: 'Method Not Allowed',
      })
  }
})