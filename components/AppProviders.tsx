"use client";

import { ThemeProvider } from "next-themes";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import { useEffect, useState } from "react";

export function AppProviders({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Prevent hydration mismatch by rendering just children or loading
        return <>{children}</>;
    }

    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <I18nextProvider i18n={i18n}>
                {children}
            </I18nextProvider>
        </ThemeProvider>
    );
}
