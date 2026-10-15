import { useState } from "react";
import type { FormEvent } from "react";
import { clsx } from "clsx";
import { useNavigate } from "react-router-dom";
import { Button, Input, Loading } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/api/userService";
import type { User } from "@/types";

interface EditProfileErrors {
  name?: string;
  username?: string;
}

interface FormMessage {
  type: "success" | "error";
  text: string;
}

export function EditProfile() {
  const { user, isHydrated } = useAuth();

  if (!isHydrated) {
    return (
      <div className="mx-auto flex max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <Loading />
      </div>
    );
  }

  if (!user) return null;

  return <EditProfileForm key={user.id} user={user} />;
}

function validateName(value: string): string | undefined {
  return value.trim() ? undefined : "Informe seu nome.";
}

function validateUsername(value: string): string | undefined {
  return value.trim().length >= 3
    ? undefined
    : "O username deve ter pelo menos 3 caracteres.";
}

function EditProfileForm({ user }: { user: User }) {
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [errors, setErrors] = useState<EditProfileErrors>({});
  const [touched, setTouched] = useState<{
    name?: boolean;
    username?: boolean;
  }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<FormMessage | null>(null);

  const handleNameChange = (value: string) => {
    setName(value);

    if (touched.name) {
      setErrors((prev) => ({ ...prev, name: validateName(value) }));
    }
  };

  const handleNameBlur = () => {
    setTouched((prev) => ({ ...prev, name: true }));
    setErrors((prev) => ({ ...prev, name: validateName(name) }));
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);

    if (touched.username) {
      setErrors((prev) => ({
        ...prev,
        username: validateUsername(value),
      }));
    }
  };

  const handleUsernameBlur = () => {
    setTouched((prev) => ({ ...prev, username: true }));
    setErrors((prev) => ({
      ...prev,
      username: validateUsername(username),
    }));
  };

  const handleAvatarChange = (file: File | undefined) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setMessage({
        type: "error",
        text: "Formato inválido. Use JPEG, PNG ou WebP.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "A imagem deve ter no máximo 5 MB.",
      });
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setMessage(null);
  };

  const uploadAvatar = async (file: File) => {
    return userService.uploadAvatar(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: EditProfileErrors = {
      name: validateName(name),
      username: validateUsername(username),
    };

    setErrors(nextErrors);
    setTouched({ name: true, username: true });

    if (nextErrors.name || nextErrors.username) return;

    setIsSaving(true);
    setMessage(null);

    try {
      await updateUser({
        name: name.trim(),
        username: username.trim(),
        bio: bio.trim() || null,
      });

      if (avatarFile) {
        const updatedUser = await uploadAvatar(avatarFile);
        updateUser(updatedUser);
      }

      setMessage({
        type: "success",
        text: "Perfil atualizado com sucesso!",
      });

      window.setTimeout(() => navigate("/profile"), 800);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);

      setMessage({
        type: "error",
        text: "Erro ao salvar o perfil. Tente novamente.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-text sm:text-3xl">
          Editar perfil
        </h1>

        <p className="text-sm text-text-muted">
          Atualize suas informações pessoais.
        </p>
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

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-text">
            Foto de perfil
          </label>

          <div className="flex items-center gap-4">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Prévia do avatar"
                className="h-20 w-20 rounded-full border border-border object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-border bg-surface text-2xl font-bold text-text">
                {name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="flex flex-col items-start gap-2">
              <label
                htmlFor="avatar-upload"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text transition-all duration-200 hover:border-primary hover:bg-accent/10"
              >
                {/* Ícone de upload */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Escolher imagem
              </label>

              <input
                id="avatar-upload"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(event) => {
                  handleAvatarChange(event.target.files?.[0]);

                  event.target.value = "";
                }}
              />

              <p className="text-xs text-text-muted">
                PNG, JPG ou WebP · Máximo 5 MB
              </p>
            </div>
          </div>
        </div>

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
              "animate-fade-in rounded-md border px-3 py-2 text-sm",
              message.type === "success"
                ? "border-success/30 bg-success/10 text-success"
                : "border-red-500/30 bg-red-500/10 text-red-500",
            )}
          >
            {message.text}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/profile")}
          >
            Cancelar
          </Button>

          <Button type="submit" isLoading={isSaving}>
            Salvar
          </Button>
        </div>
      </form>
    </div>
  );
}
