import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event)

  // 查找用户并包含角色信息
  const user = await prisma.user.findUnique({
    where: { username },
    include: { role: true },
  })

  // 验证用户和密码
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw createError({
      statusCode: 401,
      message: '用户名或密码错误',
    })
  }

  // 生成 JWT token
  const token = jwt.sign(
    { userId: user.id, roleId: user.roleId },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )

  // 返回 token 和用户信息（不包含密码）
  return { token, user: { id: user.id, username: user.username, role: user.role } }
})