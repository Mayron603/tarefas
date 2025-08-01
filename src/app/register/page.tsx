"use client";

import { useFormState, useFormStatus } from "react-dom";
import { register } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GanttChartSquare, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function RegisterPage() {
    const [state, formAction] = useFormState(register, null);
    const { toast } = useToast();

     useEffect(() => {
        if (state?.success === false) {
            toast({
                title: "Erro de Registro",
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
                    <CardTitle className="text-2xl font-bold font-headline">Crie sua Conta</CardTitle>
                    <CardDescription>Insira seus dados para começar a gerenciar suas tarefas</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input id="name" name="name" type="text" placeholder="Seu nome completo" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        {state?.error && (
                            <p className="text-sm text-destructive">{state.error}</p>
                        )}
                        <RegisterButton />
                    </form>
                     <div className="mt-4 text-center text-sm">
                        Já tem uma conta?{' '}
                        <Link href="/login" className="underline">
                            Entrar
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


function RegisterButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" className="w-full" aria-disabled={pending}>
           {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
           {pending ? "Registrando..."