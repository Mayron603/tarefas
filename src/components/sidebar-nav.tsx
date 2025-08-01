"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, ListTodo, FileDown, Calendar } from "lucide-react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

export function SidebarNav() {
  const pathname = usePathname();
  const { toast } = useToast();

  const menuItems = [
    { href: "/", label: "Quadro de Tarefas", icon: ListTodo },
    { href: "/dashboard", label: "Painel", icon: BarChart2 },
    { href: "#", label: "Relatórios", icon: FileDown, action: () => toast({ title: "Em Breve!", description: "A geração de relatórios estará disponível em breve."}), disabled: true },
    { href: "#", label: "Sincronizar Calendário", icon: Calendar, action: () => toast({ title: "Em Breve!", description: "A sincronização com o calendário estará disponível em breve."}), disabled: true },
  ];

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.label}>
            <SidebarMenuButton
                asChild
                isActive={item.href !== '#' && pathname === item.href}
                tooltip={item.label}
                onClick={item.action}
                disabled={item.disabled}
            >
                <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
