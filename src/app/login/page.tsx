"use client";

import { useActionState } from "react";
import { login } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { GanttChartSquare, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useFormStatus } from "react-dom";

export default function LoginPage() {
    const [state, formAction] = useActionState(login, null);
    const { toast } = useToast();

    useEffect(() => {
        if (state?.success === false && state.error) {
            toast({
                title: "Erro de Login",
                description: state.error,
                variant: "destructive",
            });
        }
    }, [state, toast]);


    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="mx-auto max-w-sm w-full">
                <CardHeader className="space-y-1 text-center">
                    <div className="inline-block mx-auto">
                     <GanttChartSquare className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold font-headline">Bem-vindo de volta!</CardTitle>
                    <CardDescription>Insira suas credenciais para acessar seu quadro</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Senha</Label>
                                <Link href="/forgot-password" passHref className="ml-auto inline-block text-sm underline">
                                    Esqueceu sua senha?
                                </Link>
                            </div>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <LoginButton />
                    </form>
                     <div className="mt-4 text-center text-sm">
                        Não tem uma conta?{' '}
                        <Link href="/register" className="underline">
                            Registre-se
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" className="w-full" aria-disabled={pending}>
           {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
           {pending ? "Entrando..." : "Entrar"}
        </Button>
    );
}
