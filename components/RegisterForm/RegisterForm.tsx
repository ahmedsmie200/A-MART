"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rePassword: z.string().min(6, "Password confirmation is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
}).refine((data) => data.password === data.rePassword, {
  message: "Passwords don't match",
  path: ["rePassword"],
})

type FormData = z.infer<typeof formSchema>

export default function RegisterForm() {
  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },
  })

  const [registerError, setRegisterError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const onSubmit = async (data: FormData) => {
    setRegisterError(null)
    setIsLoading(true)

    try {
      const response = await fetch(
        "https://ecommerce.routemisr.com/api/v1/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
            rePassword: data.rePassword,
            phone: data.phone,
          }),
        }
      )

      const result = await response.json()

      if (response.ok) {
        toast.success("Account created successfully!")
        router.push("/login")
      } else {
        setRegisterError(result.message || "Registration failed")
        toast.error(result.message || "Registration failed")
      }
    } catch (error) {
      setRegisterError("An unexpected error occurred.")
      toast.error("Something went wrong!")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Full Name</label>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type="text"
                  placeholder="John Doe"
                  className={`h-11 bg-slate-50 border-slate-200 focus:bg-white focus:ring-primary/20 transition-all rounded-xl shadow-sm text-sm ${
                    fieldState.invalid ? "border-red-500 focus-visible:ring-red-500" : ""
                  }`}
                />
                {fieldState.invalid && (
                  <p className="text-[10px] text-red-500 font-medium">{fieldState.error?.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Email</label>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    type="email"
                    placeholder="you@example.com"
                    className={`h-11 bg-slate-50 border-slate-200 focus:bg-white focus:ring-primary/20 transition-all rounded-xl shadow-sm text-sm ${
                      fieldState.invalid ? "border-red-500 focus-visible:ring-red-500" : ""
                    }`}
                  />
                  {fieldState.invalid && (
                    <p className="text-[10px] text-red-500 font-medium">{fieldState.error?.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Phone</label>
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    type="tel"
                    placeholder="01234567890"
                    className={`h-11 bg-slate-50 border-slate-200 focus:bg-white focus:ring-primary/20 transition-all rounded-xl shadow-sm text-sm ${
                      fieldState.invalid ? "border-red-500 focus-visible:ring-red-500" : ""
                    }`}
                  />
                  {fieldState.invalid && (
                    <p className="text-[10px] text-red-500 font-medium">{fieldState.error?.message}</p>
                  )}
                </>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Password</label>
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    type="password"
                    placeholder="••••••••"
                    className={`h-11 bg-slate-50 border-slate-200 focus:bg-white focus:ring-primary/20 transition-all rounded-xl shadow-sm text-sm ${
                      fieldState.invalid ? "border-red-500 focus-visible:ring-red-500" : ""
                    }`}
                  />
                  {fieldState.invalid && (
                    <p className="text-[10px] text-red-500 font-medium">{fieldState.error?.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Confirm</label>
            <Controller
              name="rePassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    type="password"
                    placeholder="••••••••"
                    className={`h-11 bg-slate-50 border-slate-200 focus:bg-white focus:ring-primary/20 transition-all rounded-xl shadow-sm text-sm ${
                      fieldState.invalid ? "border-red-500 focus-visible:ring-red-500" : ""
                    }`}
                  />
                  {fieldState.invalid && (
                    <p className="text-[10px] text-red-500 font-medium">{fieldState.error?.message}</p>
                  )}
                </>
              )}
            />
          </div>
        </div>

        {registerError && (
          <div className="p-3 mt-2 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 font-medium text-center">
            {registerError}
          </div>
        )}

        <Button
          disabled={isLoading}
          type="submit"
          className="w-full h-12 mt-6 bg-slate-950 text-white hover:bg-primary rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] group"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <span className="flex items-center gap-2">
              Create account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm font-medium text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-primary hover:text-primary/80 transition-colors">
          Log in
        </Link>
      </div>
    </div>
  )
}
