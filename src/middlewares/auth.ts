// middlewares/auth.ts
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify({ onlyCookie: true })
  } catch {
    return reply.code(401).send({ message: 'Não autenticado' })
  }
}