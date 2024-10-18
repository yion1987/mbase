import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  switch (method) {
    case 'GET':
      // 获取所有用户（不包含密码）
      return await prisma.user.findMany({
        include: { role: true },
        select: { id: true, username: true, roleId: true, role: { select: { name: true } } },
      })
    case 'POST':
      // 创建新用户
      const { username, password, roleId } = await readBody(event)
      const hashedPassword = bcrypt.hashSync(password, 10)
      return await prisma.user.create({
        data: { username, password: hashedPassword, roleId },
        select: { id: true, username: true, roleId: true },
      })
    default:
      throw createError({
        statusCode: 405,
        message: 'Method Not Allowed',
      })
  }
})