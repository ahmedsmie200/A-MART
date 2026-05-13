"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, ArrowRight } from "lucide-react"

const formSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required."),
  password: z.string().min(1, "Password is required."),
})

type FormData = z.infer<typeof formSchema>

export default function LoginForm() {
  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("callbackUrl") || "/"

  const [loginError, setLoginError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const onSubmit = async (data: FormData) => {
    setLoginError(null)
    setIsLoading(true)

    try {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: redirectUrl ? redirectUrl : "/",
        redirect: false,
      })

      if (response?.error) {
        setLoginError("Invalid email or password")
        form.setError("password", { message: "Invalid email or password" })
      } else if (response?.ok) {
        router.push("/products")
        router.refresh()
      }
    } catch (error) {
      setLoginError("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">
            Email
          </label>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type="email"
                  placeholder="you@example.com"
                  className={`h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-primary/20 transition-all rounded-xl shadow-sm text-sm ${
                    fieldState.invalid ? "border-red-500 focus-visible:ring-red-500" : ""
                  }`}
                />
                {fieldState.invalid && (
                  <p className="text-xs text-red-500 font-medium">{fieldState.error?.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">
              Password
            </label>
            <Link href="#" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">
              Forgot password?
            </Link>
          </div>
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type="password"
                  placeholder="••••••••"
                  className={`h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-primary/20 transition-all rounded-xl shadow-sm text-sm ${
                    fieldState.invalid ? "border-red-500 focus-visible:ring-red-500" : ""
                  }`}
                />
                {fieldState.invalid && (
                  <p className="text-xs text-red-500 font-medium">{fieldState.error?.message}</p>
                )}
              </>
            )}
          />
        </div>

        {loginError && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600 font-medium text-center">
            {loginError}
          </div>
        )}

        <Button
          disabled={isLoading}
          type="submit"
          className="w-full h-12 mt-4 bg-slate-950 text-white hover:bg-primary rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] group"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <span className="flex items-center gap-2">
              Sign in to account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm font-medium text-slate-500">
        Don't have an account?{" "}
        <Link href="/register" className="font-bold text-primary hover:text-primary/80 transition-colors">
          Sign up
        </Link>
      </div>
    </div>
  )
}
