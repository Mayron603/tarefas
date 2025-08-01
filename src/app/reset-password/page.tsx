"use client";

import { useActionState, useEffect, Suspense } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { GanttChartSquare, Loader2, KeyRound } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [state, formAction] = useActionState(resetPassword, null);
    const { toast } = useToast();

    useEffect(() => {
        if (state?.success === false && state.error) {
            const errorMessage = typeof state.error === 'object' ?
                Object.values(state.error).flat().join(', ') :
                state.error;

            toast({
                title: "Erro ao Redefinir Senha",
                description: errorMessage,
                variant: "destructive",
            });
        }
    }, [state, toast]);

    if (!token) {
        return (
             <Alert variant="destructive">
                <AlertTitle>Token Inválido</AlertTitle>
                <AlertDescription>
                    O link de redefinição de senha está incompleto. Por favor, solicite um novo link.
                     <Button asChild variant="link" className="p-1">
                        <Link href="/forgot-password">Solicitar novamente</Link>
                    </Button>
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <form action={formAction} className="space-y-4">
            <input type="hidden" name="token" value={token} />
            <div className="space-y-2">
                <Label htmlFor="password">Nova Senha</Label>
                <Input id="password" name="password" type="password" required />
                 {typeof state?.error === 'object' && state.error?.password && <p className="text-sm font-medium text-destructive">{state.error.password[0]}</p>}
            </div>
            <SubmitButton />
        </form>
    );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="space-y-1 text-center">
          <div className="inline-block mx-auto">
            <KeyRound className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold font-headline">Redefinir sua Senha</CardTitle>
          <CardDescription>
            Digite sua nova senha abaixo.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Suspense fallback={<p>Carregando...</p>}>
              <ResetPasswordForm />
            </Suspense>
          <div className="mt-4 text-center text-sm">
            Lembrou da senha?{' '}
            <Link href="/login" className="underline">
              Fazer Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" aria-disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? "Redefinindo..." : "Redefinir Senha"}
    </Button>
  );
}
