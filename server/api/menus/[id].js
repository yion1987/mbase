import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id)
  const method = event.node.req.method

  switch (method) {
    case 'GET':
      return await prisma.menu.findUnique({
        where: { id },
        include: { role: true },
      })
    case 'PUT':
      const { name, path, icon, roleId } = await readBody(event)
      return await prisma.menu.update({
        where: { id },
        data: { name, path, icon, roleId },
        include: { role: true },
      })
    case 'DELETE':
      return await prisma.menu.delete({ where: { id } })
    default:
      throw createError({
        statusCode: 405,
        message: 'Method Not Allowed',
      })
  }
})