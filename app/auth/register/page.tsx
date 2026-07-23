"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerSchema } from "@/lib/validations/auth";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { TurnstileWidget } from "@/components/auth/TurnstileWidget";
import { Container } from "@/components/shared/Container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { AlertCircle, MailCheck } from "lucide-react";

const extendedRegisterSchema = registerSchema.extend({
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormInput = z.infer<typeof extendedRegisterSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(extendedRegisterSchema),
    defaultValues: {
      turnstileToken: "",
    },
  });

  const passwordValue = watch("password", "");

  const handleTurnstileSuccess = (token: string) => {
    setValue("turnstileToken", token, { shouldValidate: true });
  };

  const onSubmit = async (data: FormInput) => {
    try {
      setIsLoading(true);
      setErrorMsg(null);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          turnstileToken: data.turnstileToken,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData?.error?.message || responseData?.message || "Registration failed");
      }

      setUserEmail(data.email);
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err?.message || "An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="py-12 sm:py-16 flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Container className="max-w-md">
          <Card className="text-center shadow-sm">
            <CardHeader className="space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 mb-2">
                <MailCheck className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Check your email</CardTitle>
              <CardDescription className="text-sm">
                We have sent a verification link to <strong className="text-foreground">{userEmail}</strong>.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-muted-foreground leading-relaxed">
              <p>
                Please click the link in your email to verify your account before logging in.
              </p>
            </CardContent>
            <CardFooter className="justify-center border-t border-border pt-4">
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Back to Sign In
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Container className="max-w-md">
        <Card className="shadow-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
            <CardDescription>
              Join Webify Solutions to access courses and tech services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {errorMsg && (
              <div className="flex items-center space-x-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Full Name</label>
                <Input
                  placeholder="John Doe"
                  {...register("name")}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Email address</label>
                <Input
                  type="email"
                  placeholder="you@domain.com"
                  {...register("email")}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
                {/* Real-time Password Strength Meter */}
                <PasswordStrengthIndicator password={passwordValue} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Turnstile Captcha */}
              <div className="space-y-1">
                <TurnstileWidget onSuccess={handleTurnstileSuccess} />
                {errors.turnstileToken && (
                  <p className="text-xs text-destructive text-center">
                    {errors.turnstileToken.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <LoadingSpinner size="sm" label="Creating account..." /> : "Create Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center text-xs text-muted-foreground border-t-0 pt-0">
            <span>Already have an account? </span>
            <Link href="/auth/login" className="text-primary font-semibold ml-1 hover:underline">
              Sign in
            </Link>
          </CardFooter>
        </Card>
      </Container>
    </div>
  );
}
