"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListTodo, PieChart, CalendarDays, CaseSensitive } from "lucide-react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarSeparator } from "@/components/ui/sidebar";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo } from "react";

export function SidebarNav() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/", label: "Quadro de Tarefas", icon: ListTodo },
    { href: "/feedbacks", label: "Feedbacks", icon: PieChart },
  ];

  const weekDays = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(today, i);
      return {
        href: `/tasks/${format(date, 'yyyy-MM-dd')}`,
        label: format(date, "EEEE - dd", { locale: ptBR }),
      };
    });
  }, []);

  return (
    <>
      <SidebarGroup>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>

      <SidebarSeparator />
      
      <SidebarGroup>
        <SidebarGroupLabel className="flex items-center">
          <CalendarDays />
          <span>Navegação Semanal</span>
        </SidebarGroupLabel>
        <SidebarMenu>
          {weekDays.map((day) => (
            <SidebarMenuItem key={day.label}>
              <SidebarMenuButton asChild variant="ghost" isActive={pathname === day.href}>
                <Link href={day.href}>
                  <CaseSensitive className="w-4 h-4 mr-2"/>
                  <span className="capitalize">{day.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
