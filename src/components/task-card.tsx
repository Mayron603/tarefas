import { useState } from "react";
import { Task } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, MessageSquareQuote, Play } from "lucide-react";
import { formatDistanceToNow, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CompleteTaskDialog } from "./complete-task-dialog";
import { useToast } from "@/hooks/use-toast";
import { startTask } from "@/app/actions";

const priorityText = {
    high: "Alta",
    medium: "Média",
    low: "Baixa",
}

export function TaskCard({ task }: { task: Task }) {
  const { toast } = useToast();
  const deadlineDate = new Date(task.deadline);
  const isDeadlinePast = isPast(deadlineDate);
  const [isStarting, setIsStarting] = useState(false);

  const handleStartTask = async () => {
    setIsStarting(true);
    const result = await startTask(task.id);
    if (result.success) {
      toast({
        title: "Tarefa iniciada!",
        description: "A tarefa foi movida para 'Em Progresso'.",
      });
    } else {
      toast({
        title: "Erro",
        description: result.error,
        variant: "destructive",
      });
    }
    setIsStarting(false);
  }

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 animate-in fade-in-50 flex flex-col justify-between h-full">
      <div>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base font-semibold leading-tight">{task.title}</CardTitle>
        </CardHeader>
        {task.description && 
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
          </CardContent>
        }
         {task.status === 'done' && task.resolution && (
            <CardContent className="p-4 pt-0">
                <div className="bg-accent/30 p-3 rounded-md border border-accent">
                    <div className="flex items-center gap-2 mb-2">
                         <MessageSquareQuote className="h-4 w-4 text-accent-foreground" />
                        <p className="text-sm font-semibold text-accent-foreground">Nota de Resolução:</p>
                    </div>
                    <p className="text-sm text-accent-foreground/80 italic">&quot;{task.resolution}&quot;</p>
                </div>
            </CardContent>
         )}
      </div>
      <CardFooter className="flex justify-between items-center p-4 pt-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'secondary' : 'outline'}>
            {priorityText[task.priority]}
          </Badge>
          <div className={cn("flex items-center gap-1", isDeadlinePast ? "text-destructive" : "")}>
            <Clock className="h-4 w-4" />
            <span>{formatDistanceToNow(deadlineDate, { addSuffix: true, locale: ptBR })}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {task.status === 'todo' && (
              <Button size="sm" variant="outline" onClick={handleStartTask} disabled={isStarting}>
                  <Play className="mr-2 h-4 w-4" />
                  {isStarting ? "Iniciando..." : "Iniciar"}
              </Button>
          )}
          {task.status === 'inprogress' && (
              <CompleteTaskDialog task={task}>
                  <Button size="sm" variant="outline">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Concluir
                  </Button>
              </CompleteTaskDialog>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
