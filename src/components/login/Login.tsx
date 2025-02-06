"use client"
import { useState } from "react"
import {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  useForm,
} from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { ArrowRight, Lock, Mail } from "lucide-react"
import Image from "next/image"

export const Login = () => {
  const [loginError, setLoginError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data: FieldValues) => {
    const { email, password } = data

    setIsLoading(true)
    setLoginError("")

    try {
      console.log("Login:", email, password)
      const response = await fetch(
        "https://comanda-flash-production.up.railway.app/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ login: email, password }),
        }
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.message || "Erro ao fazer login. Tente novamente."
        )
      }
      const result = await response.json()
      console.log("Login bem-sucedido:", result)
      const token = result.token
      localStorage.setItem("token", token)

      setLoginError("")
      setIsLoading(false)
    } catch (error) {
      setLoginError("Erro ao fazer login. Tente novamente." + error)
      setRetryCount((prev) => prev + 1)
    } finally {
      setIsLoading(false)
    }
  }

  const getErrorMessage = (
    error:
      | FieldError
      | Merge<FieldError, FieldErrorsImpl<Record<string, unknown>>>
  ): string => {
    if ("type" in error && error.type === "pattern") return "Email inválido"
    if ("message" in error && typeof error.message === "string") {
      return error.message
    }
    return ""
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B2B]/10 via-transparent to-[#E31837]/10" />
      <div className="relative w-full max-w-md px-4 py-8">
        <div className="flex items-center justify-center w-full">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20for%20Comanda%20Flash%20digital%20ordering%20system,%20dramatic%20cinematic%20style,%20geometric%20shapes,%20clean%20lines,%20balance,%20symmetry,%20visual%20clarity,%20warm%20inspired,%20reds,%20oranges,%20yellows,%20film-like%20composition.jpg-N91eYhIC11xkdEbQL33CjhcAW31KWn.jpeg"
            alt="Comanda Flash Logo"
            width={500}
            height={500}
            priority={true}
            className="w-full h-48 object-cover"
          />
        </div>
        <Card className="w-full border-none bg-black/40 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1 pt-8">
            <CardTitle className="text-2xl text-center font-bold bg-gradient-to-r from-[#FF6B2B] to-[#FFD700] bg-clip-text text-transparent">
              Bem vindo de volta
            </CardTitle>

            {loginError && (
              <div className="mb-4 bg-red-950/50 p-3 rounded-md text-zinc-200 animate-fade-in">
                {loginError}
              </div>
            )}
            <CardDescription className="text-zinc-400 text-center">
              Entre usando seu email e sua senha
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-200">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-zinc-400" />
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    {...register("email", {
                      required: "Email é obrigatório",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Email inválido",
                      },
                    })}
                    className="pl-10 bg-black/50 border-zinc-800 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-[#FF6B2B]"
                  />
                  {errors.email && (
                    <span className="text-red-500">
                      {getErrorMessage(errors.email)}
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-200">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-zinc-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="******"
                    {...register("password", {
                      required: "Senha é obrigatória",
                      minLength: {
                        value: 6,
                        message: "Senha deve ter pelo menos 6 caracteres",
                      },
                    })}
                    className="pl-10 bg-black/50 border-zinc-800 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-[#FF6B2B]"
                  />
                  {errors.password && (
                    <span className="text-red-500">
                      {getErrorMessage(errors.password)}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className={`
                  w-full bg-gradient-to-r from-[#FF6B2B] to-[#E31837] 
                  hover:opacity-90 transition-opacity
                  ${retryCount >= 3 ? "animate-shake" : ""}
                `}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-200 border-t-transparent" />
                    <span>Entrando...</span>
                  </div>
                ) : retryCount >= 3 ? (
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-white" />
                    <span>Verifique suas credenciais</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Entrar</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
