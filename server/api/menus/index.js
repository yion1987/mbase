import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  switch (method) {
    case 'GET':
      // 获取所有菜单，包括关联的角色信息
      return await prisma.menu.findMany({
        include: { role: true },
      })
    case 'POST':
      // 创建新菜单
      const { name, path, icon, roleId } = await readBody(event)
      return await prisma.menu.create({
        data: { name, path, icon, roleId },
        include: { role: true },
      })
    default:
      throw createError({
        statusCode: 405,
        message: 'Method Not Allowed',
      })
  }
})