import { Task } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { formatDistanceToNow, isPast } from "date-fns";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const priorityText = {
    high: "High",
    medium: "Medium",
    low: "Low",
}

export function TaskCard({ task }: { task: Task }) {
  const deadlineDate = new Date(task.deadline);
  const isDeadlinePast = isPast(deadlineDate);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 animate-in fade-in-50">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-semibold leading-tight">{task.title}</CardTitle>
      </CardHeader>
      {task.description && 
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
        </CardContent>
      }
      <CardFooter className="flex justify-between items-center p-4 pt-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'secondary' : 'outline'}>
            {priorityText[task.priority]}
          </Badge>
          <div className={cn("flex items-center gap-1", isDeadlinePast ? "text-destructive" : "")}>
            <Clock className="h-4 w-4" />
            <span>{formatDistanceToNow(deadlineDate, { addSuffix: true })}</span>
          </div>
        </div>
        {task.assignee && (
          <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <Avatar className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={task.assignee.avatarUrl} alt={task.assignee.name} data-ai-hint="person face" />
                        <AvatarFallback>{task.assignee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{task.assignee.name}</p>
                </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardFooter>
    </Card>
  );
}
