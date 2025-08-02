"use client";

import { cn } from "@/lib/utils";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <div className={cn("font-body", "antialiased", "bg-background")}>
            {children}
        </div>
    )
}
