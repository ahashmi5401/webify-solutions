"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { Container } from "@/components/shared/Container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { AlertCircle, ArrowLeft } from "lucide-react";

const extendedResetPasswordSchema = resetPasswordSchema.extend({
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormInput = z.infer<typeof extendedResetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(extendedResetPasswordSchema),
    defaultValues: {
      token: token || "",
    },
  });

  const passwordValue = watch("password", "");

  React.useEffect(() => {
    if (!token) {
      setErrorMsg("Missing reset token in URL. Please request a new password reset link.");
    }
  }, [token]);

  const onSubmit = async (data: FormInput) => {
    if (!token) {
      setErrorMsg("Missing reset token.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg(null);

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData?.error?.message || responseData?.message || "Failed to reset password");
      }

      router.push("/auth/login?reset=success");
    } catch (err: any) {
      setErrorMsg(err?.message || "An error occurred while resetting your password.");
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Container className="max-w-md">
        <Card className="shadow-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Set new password</CardTitle>
            <CardDescription>
              Please enter your new password below
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
                <label className="text-xs font-medium text-foreground">New Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  disabled={isLoading || !token}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
                <PasswordStrengthIndicator password={passwordValue} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Confirm New Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  disabled={isLoading || !token}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || !token}>
                {isLoading ? <LoadingSpinner size="sm" label="Resetting password..." /> : "Reset Password"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center text-xs text-muted-foreground border-t-0 pt-0">
            <Link href="/auth/login" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              <span>Back to Sign In</span>
            </Link>
          </CardFooter>
        </Card>
      </Container>
    </div>
  );
}
