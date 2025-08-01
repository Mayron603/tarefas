"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { requestPasswordReset } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { GanttChartSquare, Loader2, KeyRound } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(requestPasswordReset, null);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.success === false && state.error) {
      toast({
        title: "Erro",
        description: state.error,
        variant: "destructive",
      });
    }
    if (state?.success === true && state.message && !state.resetLink) {
         toast({
            title: "Verifique seu Email",
            description: state.message,
            className: "bg-accent text-accent-foreground border-0",
        });
    }
  }, [state, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="space-y-1 text-center">
          <div className="inline-block mx-auto">
            <KeyRound className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold font-headline">Esqueceu sua Senha?</CardTitle>
          <CardDescription>
            Sem problemas. Insira seu email e enviaremos um link para você redefinir sua senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state?.resetLink ? (
            <div className="space-y-4">
                <Alert>
                    <AlertTitle>Link Gerado!</AlertTitle>
                    <AlertDescription>
                        Em uma aplicação real, este link seria enviado para o seu e-mail. Para este ambiente de demonstração, clique no link abaixo para prosseguir.
                    </AlertDescription>
                </Alert>
                 <Button asChild className="w-full">
                    <Link href={state.resetLink}>Redefinir Senha Agora</Link>
                </Button>
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
              </div>
              <SubmitButton />
            </form>
          )}
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
      {pending ? "Enviando..." : "Enviar Link de Redefinição"}
    </Button>
  );
}
