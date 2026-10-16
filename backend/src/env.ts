import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url('DATABASE_URL inválida.'),
  JWT_SECRET:   z.string().min(32, 'JWT_SECRET deve ter no mínimo 32 caracteres.'),
  TMDB_TOKEN:   z.string().min(1, 'TMDB_TOKEN é obrigatório.'),
  PORT:         z.coerce.number().default(3000),
  NODE_ENV:     z.enum(['development', 'production', 'test']).default('development'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Variáveis de ambiente inválidas:')
  console.error(parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data
  