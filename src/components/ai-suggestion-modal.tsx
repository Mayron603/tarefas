"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Wand2, Loader2, ArrowRight } from 'lucide-react';
import { teamMembers } from '@/lib/team';
import { getTaskDistributionSuggestions, fetchTasks } from '@/app/actions';
import type { SuggestOptimalTaskDistributionOutput } from '@/ai/flows/suggest-optimal-task-distribution';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

export function AiSuggestionModal() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestOptimalTaskDistributionOutput | null>(null);
  const { toast } = useToast();

  async function handleGetSuggestions() {
    setIsLoading(true);
    setSuggestions(null);

    const allTasks = await fetchTasks();
    
    const unassignedTasks = allTasks
        .filter(t => t.status === 'todo')
        .map(task => ({
            name: task.title,
            description: task.description || 'Sem descrição',
            deadline: task.deadline,
            priority: task.priority.charAt(0).toUpperCase() + task.priority.slice(1) as 'High' | 'Medium' | 'Low',
        }));
    
    if (unassignedTasks.length === 0) {
        toast({
            title: "Nenhuma Tarefa para Atribuir",
            description: "Não há tarefas na coluna 'A Fazer' para atribuir.",
            variant: "default",
        });
        setIsLoading(false);
        return;
    }

    const result = await getTaskDistributionSuggestions({
      tasks: unassignedTasks,
      teamMembers: teamMembers,
    });

    setIsLoading(false);
    if (result.success && result.data) {
      setSuggestions(result.data);
    } else {
      toast({
        title: "Erro",
        description: result.error,
        variant: "destructive",
      });
    }
  }

  function handleApply() {
      toast({
          title: "Sugestões Aplicadas!",
          description: "As tarefas foram atribuídas com base nas sugestões da IA.",
          className: "bg-accent text-accent-foreground border-0",
      });
      setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Wand2 className="mr-2 h-4 w-4" />
          Sugestões de IA
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Distribuição de Tarefas com IA</DialogTitle>
          <DialogDescription>
            Deixe a IA sugerir a distribuição ideal de tarefas para sua equipe com base em habilidades, disponibilidade e carga de trabalho.
          </DialogDescription>
        </DialogHeader>

        {!suggestions && !isLoading && (
          <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="p-4 rounded-full bg-primary/10">
                  <Wand2 className="h-10 w-10 text-primary" />
              </div>
              <p className="text-muted-foreground">Clique no botão abaixo para gerar atribuições para tarefas 'A Fazer'.</p>
          </div>
        )}

        {isLoading && (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4">Analisando tarefas e membros da equipe...</p>
            </div>
        )}
        
        {suggestions && (
            <div className="max-h-[50vh] overflow-y-auto p-1 pr-4 space-y-4">
                {suggestions.assignments.map((assignment, index) => (
                    <div key={index}>
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
                           <div className="font-semibold">{assignment.taskName}</div>
                           <ArrowRight className="h-5 w-5 text-muted-foreground"/>
                           <div>
                                <Badge>{assignment.teamMemberName}</Badge>
                           </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 text-center italic">
                            &quot;{assignment.reason}&quot;
                        </p>
                        {index < suggestions.assignments.length - 1 && <Separator className="my-4"/>}
                    </div>
                ))}
            </div>
        )}

        <DialogFooter className="pt-4 sm:justify-between">
            <div>
            {suggestions && <Button onClick={handleApply}>Aplicar Sugestões</Button>}
            </div>
            <div className='flex gap-2'>
            {suggestions && (
                 <Button type="button" variant="ghost" onClick={() => setSuggestions(null)}>
                    Limpar
                </Button>
            )}
            <Button onClick={handleGetSuggestions} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                {suggestions ? 'Gerar Novamente' : 'Gerar Sugestões'}
            </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
