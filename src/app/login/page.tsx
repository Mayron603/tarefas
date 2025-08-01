import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GanttChartSquare } from "lucide-react";

export default function LoginPage() {
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
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="seu@email.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input id="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full">
                            Entrar
                        </Button>
                         <Button variant="outline" className="w-full">
                            Entrar com Google
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
