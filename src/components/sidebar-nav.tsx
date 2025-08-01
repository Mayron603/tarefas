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
    { href: "/", label: "Task Board", icon: ListTodo },
    { href: "/dashboard", label: "Dashboard", icon: BarChart2 },
    { href: "#", label: "Reports", icon: FileDown, action: () => toast({ title: "Coming Soon!", description: "Report generation will be available soon."}) },
    { href: "#", label: "Calendar Sync", icon: Calendar, action: () => toast({ title: "Coming Soon!", description: "Calendar sync will be available soon."}) },
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
