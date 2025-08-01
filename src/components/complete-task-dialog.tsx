
"use client";

import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { completeTask } from '@/app/actions';
import type { Task } from '@/lib/types';

const completeTaskSchema = z.object({
  resolution: z.string().min(1, 'A nota de resolução é obrigatória.'),
});

type CompleteTaskFormValues = z.infer<typeof completeTaskSchema>;

interface CompleteTaskDialogProps {
    task: Task;
    children: ReactNode;
}

export function CompleteTaskDialog({ task, children }: CompleteTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<CompleteTaskFormValues>({
    resolver: zodResolver(completeTaskSchema),
  });

  async function onSubmit(data: CompleteTaskFormValues) {
    const result = await completeTask(task.id, data.resolution);

    if (result.success) {
        toast({
            title: "Tarefa Concluída!",
            description: "A tarefa foi movida para o quadro de concluídas.",
            className: "bg-accent text-accent-foreground border-0",
        });
        setOpen(false);
        form.reset();
    } else {
        toast({
            title: "Erro ao concluir tarefa",
            description: result.error,
            variant: "destructive",
        });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Concluir Tarefa: {task.title}</DialogTitle>
          <DialogDescription>
            Adicione uma nota de resolução para esta tarefa. O que foi feito?
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="resolution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nota de Resolução</FormLabel>
                  <FormControl>
                    <Textarea placeholder="ex: Implementado o novo fluxo de login e testado em todos os navegadores." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Concluindo..." : "Marcar como Concluída"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
