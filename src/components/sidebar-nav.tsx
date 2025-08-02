"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListTodo, PieChart } from "lucide-react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export function SidebarNav() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/", label: "Quadro de Tarefas", icon: ListTodo },
    { href: "/feedbacks", label: "Feedbacks", icon: PieChart },
  ];

  return (
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
  );
}
