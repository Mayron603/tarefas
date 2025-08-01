"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AddTaskDialog } from "@/components/add-task-dialog";
import { UserNav } from "@/components/user-nav";
import type { User } from "@/lib/types";

export function Header({ user }: { user: User | null }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
      <SidebarTrigger className="md:hidden" />

      <div className="relative flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar tarefas..."
          className="w-full rounded-lg bg-secondary pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>

      <div className="flex flex-1 items-center justify-end gap-4">
        <AddTaskDialog />
        <UserNav user={user} />
      </div>
    </header>
  );
}
