import { db } from "./prisma.server";
import type { RegisterForm } from "./types.server";
import bcrypt from 'bcryptjs'

export const createUser = async (user: RegisterForm) => {
    const passwordHash = await bcrypt.hash(user.password, 10);
    const newUser = await db.admin.create({
        data:{
            email: user.email,
            password: passwordHash,
        }
    })
    return{ id: newUser.id, email: user.email}
}



export const getUserById = async (userId: string) => {
  return db.admin.findUnique({
    where: {
      id: userId
    }
  })
}