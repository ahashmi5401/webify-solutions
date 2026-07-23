"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { CheckCircle2, XCircle } from "lucide-react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = React.useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  React.useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("No verification token provided in URL.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error?.message || data?.message || "Email verification failed");
        }

        setStatus("success");
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(err?.message || "Invalid or expired verification token.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="py-12 sm:py-16 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Container className="max-w-md">
        <Card className="text-center shadow-sm">
          {status === "loading" && (
            <CardContent className="py-12">
              <LoadingSpinner size="lg" label="Verifying your email address..." />
            </CardContent>
          )}

          {status === "success" && (
            <>
              <CardHeader className="space-y-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 mb-2">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">Email verified!</CardTitle>
                <CardDescription>
                  Your email address has been successfully verified.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                You can now log in to your Webify Solutions account and start exploring courses and services.
              </CardContent>
              <CardFooter className="justify-center pt-4">
                <Link href="/auth/login" className="w-full">
                  <Button className="w-full">Proceed to Sign In</Button>
                </Link>
              </CardFooter>
            </>
          )}

          {status === "error" && (
            <>
              <CardHeader className="space-y-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-2">
                  <XCircle className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">Verification failed</CardTitle>
                <CardDescription className="text-destructive text-xs font-medium">
                  {errorMessage}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                The link may be expired or already used. Please try registering again or contact support if you need assistance.
              </CardContent>
              <CardFooter className="justify-center space-x-2 pt-4">
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">
                    Back to Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">
                    Register Again
                  </Button>
                </Link>
              </CardFooter>
            </>
          )}
        </Card>
      </Container>
    </div>
  );
}
