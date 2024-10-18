import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  switch (method) {
    case 'GET':
      // 获取所有角色
      return await prisma.role.findMany()
    case 'POST':
      // 创建新角色
      const { name } = await readBody(event)
      return await prisma.role.create({
        data: { name },
      })
    default:
      throw createError({
        statusCode: 405,
        message: 'Method Not Allowed',
      })
  }
})