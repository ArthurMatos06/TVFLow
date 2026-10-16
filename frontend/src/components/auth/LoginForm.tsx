import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import type { LoginCredentials } from "@/types/auth";
import { validateLogin } from "@/utils/validation";
import type { LoginValidationErrors } from "@/utils/validation";

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c6.5 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3.5 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

export function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<LoginValidationErrors>({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const credentials: LoginCredentials = { email, password };
    const errors = validateLogin(credentials);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

    await login(credentials);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="mb-2 text-center">
        <h1 className="text-xl font-semibold text-text">Entrar</h1>
        <p className="mt-1 text-sm text-text-muted">
          Acesse sua conta para continuar.
        </p>
      </div>

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          clearError();
        }}
        placeholder="voce@exemplo.com"
        autoComplete="email"
        error={fieldErrors.email}
      />

      <Input
        label="Senha"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          clearError();
        }}
        placeholder="Sua senha"
        autoComplete="current-password"
        error={fieldErrors.password}
        trailing={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition-colors hover:text-text"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        }
      />

      {error && (
        <p
          role="alert"
          className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500"
        >
          {error}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        isLoading={isLoading}
        className="w-full cursor-pointer"
      >
        Entrar
      </Button>

      <p className="text-center text-sm text-text-muted">
        Não tem uma conta?{" "}
        <Link
          to="/register"
          className="font-medium text-accent transition-colors hover:text-text"
        >
          Criar conta
        </Link>
      </p>
    </form>
  );
}
