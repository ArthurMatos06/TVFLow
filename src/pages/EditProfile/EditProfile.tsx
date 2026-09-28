import { useState } from 'react'
import type { FormEvent } from 'react'
import { clsx } from 'clsx'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Loading } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import type { User } from '@/types'

interface EditProfileErrors {
  name?: string
  username?: string
}

interface FormMessage {
  type: 'success' | 'error'
  text: string
}

export function EditProfile() {
  const { user, isHydrated } = useAuth()

  if (!isHydrated) {
    return (
      <div className="mx-auto flex max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <Loading />
      </div>
    )
  }

  if (!user) return null

  return <EditProfileForm key={user.id} user={user} />
}

function validateName(value: string): string | undefined {
  return value.trim() ? undefined : 'Informe seu nome.'
}

function validateUsername(value: string): string | undefined {
  return value.trim().length >= 3 ? undefined : 'O username deve ter pelo menos 3 caracteres.'
}

function EditProfileForm({ user }: { user: User }) {
  const navigate = useNavigate()
  const { updateUser } = useAuth()

  const [name, setName] = useState(user.name)
  const [username, setUsername] = useState(user.username)
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? '')
  const [bio, setBio] = useState(user.bio ?? '')
  const [errors, setErrors] = useState<EditProfileErrors>({})
  const [touched, setTouched] = useState<{ name?: boolean; username?: boolean }>({})
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<FormMessage | null>(null)

  const handleNameChange = (value: string) => {
    setName(value)
    if (touched.name) setErrors((prev) => ({ ...prev, name: validateName(value) }))
  }

  const handleNameBlur = () => {
    setTouched((prev) => ({ ...prev, name: true }))
    setErrors((prev) => ({ ...prev, name: validateName(name) }))
  }

  const handleUsernameChange = (value: string) => {
    setUsername(value)
    if (touched.username) setErrors((prev) => ({ ...prev, username: validateUsername(value) }))
  }

  const handleUsernameBlur = () => {
    setTouched((prev) => ({ ...prev, username: true }))
    setErrors((prev) => ({ ...prev, username: validateUsername(username) }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: EditProfileErrors = {
      name: validateName(name),
      username: validateUsername(username),
    }
    setErrors(nextErrors)
    setTouched({ name: true, username: true })

    if (nextErrors.name || nextErrors.username) return

    setIsSaving(true)
    setMessage(null)

    try {
      const updatedUser: User = {
        ...user,
        name: name.trim(),
        username: username.trim(),
        avatarUrl: avatarUrl.trim() || null,
        bio: bio.trim() || null,
        updatedAt: new Date().toISOString(),
      }
      updateUser(updatedUser)
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' })
      window.setTimeout(() => navigate('/profile'), 800)
    } catch {
      setMessage({ type: 'error', text: 'Erro ao salvar o perfil. Tente novamente.' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-text sm:text-3xl">Editar perfil</h1>
        <p className="text-sm text-text-muted">Atualize suas informações pessoais.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4 rounded-2xl border border-border bg-surface/60 p-6"
      >
        <Input
          label="Nome"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          onBlur={handleNameBlur}
          placeholder="Seu nome"
          error={errors.name}
        />

        <Input
          label="Username"
          value={username}
          onChange={(e) => handleUsernameChange(e.target.value)}
          onBlur={handleUsernameBlur}
          placeholder="seuusername"
          error={errors.username}
        />

        <Input
          label="Avatar URL"
          type="url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://exemplo.com/avatar.jpg"
        />

        <div className="flex w-full flex-col gap-1.5">
          <label htmlFor="bio" className="text-sm font-medium text-text">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Conte um pouco sobre você"
            className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted transition-all duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>

        {message && (
          <p
            role="alert"
            className={clsx(
              'animate-fade-in rounded-md border px-3 py-2 text-sm',
              message.type === 'success'
                ? 'border-success/30 bg-success/10 text-success'
                : 'border-red-500/30 bg-red-500/10 text-red-500',
            )}
          >
            {message.text}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate('/profile')}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSaving}>
            Salvar
          </Button>
        </div>
      </form>
    </div>
  )
}
