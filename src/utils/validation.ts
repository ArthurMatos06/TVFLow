import type { LoginCredentials } from '@/types/auth'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim())
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6
}

export function isValidName(name: string): boolean {
  const trimmed = name.trim()
  return trimmed.length >= 2 && trimmed.length <= 50
}

export interface LoginValidationErrors {
  email?: string
  password?: string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface RegisterValidationErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export function validateLogin(credentials: LoginCredentials): LoginValidationErrors {
  const errors: LoginValidationErrors = {}
  const email = credentials.email.trim()

  if (!email) {
    errors.email = 'Informe seu email.'
  } else if (!isValidEmail(email)) {
    errors.email = 'Email inválido.'
  }

  if (!credentials.password) {
    errors.password = 'Informe sua senha.'
  } else if (!isValidPassword(credentials.password)) {
    errors.password = 'A senha deve ter pelo menos 6 caracteres.'
  }

  return errors
}

export function validateRegister(data: RegisterFormData): RegisterValidationErrors {
  const errors: RegisterValidationErrors = {}
  const name = data.name.trim()
  const email = data.email.trim()

  if (!name) {
    errors.name = 'Informe seu nome.'
  } else if (!isValidName(name)) {
    errors.name = 'O nome deve ter entre 2 e 50 caracteres.'
  }

  if (!email) {
    errors.email = 'Informe seu email.'
  } else if (!isValidEmail(email)) {
    errors.email = 'Email inválido.'
  }

  if (!data.password) {
    errors.password = 'Informe sua senha.'
  } else if (!isValidPassword(data.password)) {
    errors.password = 'A senha deve ter pelo menos 6 caracteres.'
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = 'Confirme sua senha.'
  } else if (data.confirmPassword !== data.password) {
    errors.confirmPassword = 'As senhas não coincidem.'
  }

  return errors
}
