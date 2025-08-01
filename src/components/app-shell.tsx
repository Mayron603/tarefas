"use client";

import * as React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/sidebar-nav";
import { Header } from "@/components/header";
import { useIsMobile } from "@/hooks/use-mobile";
import type { User } from "@/lib/types";


export function AppShell({ children, user }: { children: React.ReactNode, user: User | null }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(true);

  React.useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar>
        <SidebarHeader>
          <h1 className="text-2xl font-bold text-primary font-headline pl-2">FluxoDeTrabalho</h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter>
          {/* Footer content if any */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background">
        <Header user={user} />
        <main className="p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
