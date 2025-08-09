
"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { register } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { PandaIcon } from "@/components/panda-icon";

export default function RegisterPage() {
    const [state, formAction] = useActionState(register, null);
    const { toast } = useToast();

     useEffect(() => {
        if (state?.success === false && state.error) {
            const errorMessage = typeof state.error === 'object' ? 
                Object.values(state.error).flat().join(', ') : 
                state.error;

            toast({
                title: "Erro de Registro",
                description: errorMessage,
                variant: "destructive",
            });
        }
    }, [state, toast]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="mx-auto max-w-sm w-full">
                <CardHeader className="space-y-1 text-center">
                    <div className="inline-block mx-auto">
                     <PandaIcon className="h-10 w-10 text-accent" />
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
           {pending ? "Registrando..." : "Registrar"}
        </Button>
    );
}
