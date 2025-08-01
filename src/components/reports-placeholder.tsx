"use client"

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function ReportsPlaceholder() {
    const { toast } = useToast();
    return (
        <Button onClick={() => toast({ title: "Em Breve!", description: "A geração de relatórios estará disponível em breve."})} disabled>
            Gerar Relatório
        </Button>
    )
}
