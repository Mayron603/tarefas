
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
import { Input } from './ui/input';
import { Upload } from 'lucide-react';
import Image from 'next/image';

const completeTaskSchema = z.object({
  resolution: z.string().min(1, 'A nota de resolução é obrigatória.'),
  proofImage: z.string().optional(), // Data URI for the image
});

type CompleteTaskFormValues = z.infer<typeof completeTaskSchema>;

interface CompleteTaskDialogProps {
    task: Task;
    children: ReactNode;
}

export function CompleteTaskDialog({ task, children }: CompleteTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const form = useForm<CompleteTaskFormValues>({
    resolver: zodResolver(completeTaskSchema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        form.setValue('proofImage', dataUri);
        setImagePreview(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };


  async function onSubmit(data: CompleteTaskFormValues) {
    const result = await completeTask(task.id, data.resolution, data.proofImage);

    if (result.success) {
        toast({
            title: "Tarefa Concluída!",
            description: "A tarefa foi movida para o quadro de concluídas.",
            className: "bg-accent text-accent-foreground border-0",
        });
        setOpen(false);
        form.reset();
        setImagePreview(null);
    } else {
        toast({
            title: "Erro ao concluir tarefa",
            description: result.error,
            variant: "destructive",
        });
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
            form.reset();
            setImagePreview(null);
        }
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Concluir Tarefa: {task.title}</DialogTitle>
          <DialogDescription>
            Adicione uma nota de resolução e uma imagem de prova (opcional).
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
            <FormItem>
                <FormLabel>Prova (Imagem Opcional)</FormLabel>
                <FormControl>
                    <div className="relative">
                        <Input id="proofImage" type="file" accept="image/*" className="pl-10" onChange={handleImageChange} />
                        <Upload className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                </FormControl>
                {imagePreview && (
                    <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Pré-visualização:</p>
                        <Image src={imagePreview} alt="Pré-visualização da prova" width={400} height={300} className="rounded-md object-cover" />
                    </div>
                )}
                <FormMessage />
            </FormItem>

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
