
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListTodo, PieChart, CalendarDays, CaseSensitive } from "lucide-react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, SidebarSeparator } from "@/components/ui/sidebar";

export function SidebarNav() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/", label: "Quadro de Tarefas", icon: ListTodo },
    { href: "/feedbacks", label: "Feedbacks", icon: PieChart },
  ];

  const weekDays = [
      { href: "#", label: "Segunda-feira" },
      { href: "#", label: "Terça-feira" },
      { href: "#", label: "Quarta-feira" },
      { href: "#", label: "Quinta-feira" },
      { href: "#", label: "Sexta-feira" },
      { href: "#", label: "Sábado" },
      { href: "#", label: "Domingo" },
  ]

  return (
    <>
    <SidebarGroup>
        <SidebarMenu>
        {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                    asChild
                    isActive={item.href !== '#' && pathname === item.href}
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
                    <SidebarMenuButton asChild variant="ghost">
                        <Link href={day.href}>
                            <CaseSensitive />
                            <span>{day.label}</span>
                        </Link>
                    </SidebarMenuButton>
                 </SidebarMenuItem>
            ))}
        </SidebarMenu>
    </SidebarGroup>
    </>
  );
}
