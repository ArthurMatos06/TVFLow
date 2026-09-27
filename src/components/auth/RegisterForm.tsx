import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import type { RegisterData } from '@/types/auth'
import { validateRegister } from '@/utils/validation'
import type { RegisterValidationErrors } from '@/utils/validation'

export function RegisterForm() {
  const navigate = useNavigate()
  const { register, isLoading, error, isAuthenticated, clearError } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<RegisterValidationErrors>({})

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const data = { name, email, password, confirmPassword }
    const errors = validateRegister(data)
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) return

    const registerData: RegisterData = { name, email, password }
    await register(registerData)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="mb-2 text-center">
        <h1 className="text-xl font-semibold text-text">Criar conta</h1>
        <p className="mt-1 text-sm text-text-muted">Cadastre-se para começar a usar o TvFlow.</p>
      </div>

      <Input
        label="Nome"
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value)
          clearError()
        }}
        placeholder="Seu nome"
        autoComplete="name"
        error={fieldErrors.name}
      />

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          clearError()
        }}
        placeholder="voce@exemplo.com"
        autoComplete="email"
        error={fieldErrors.email}
      />

      <Input
        label="Senha"
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value)
          clearError()
        }}
        placeholder="Mínimo de 6 caracteres"
        autoComplete="new-password"
        error={fieldErrors.password}
      />

      <Input
        label="Confirmar senha"
        type="password"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value)
          clearError()
        }}
        placeholder="Repita sua senha"
        autoComplete="new-password"
        error={fieldErrors.confirmPassword}
      />

      {error && (
        <p
          role="alert"
          className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500"
        >
          {error}
        </p>
      )}

      <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
        Criar conta
      </Button>

      <p className="text-center text-sm text-text-muted">
        Já tem uma conta?{' '}
        <Link to="/login" className="font-medium text-accent transition-colors hover:text-text">
          Entrar
        </Link>
      </p>
    </form>
  )
}
