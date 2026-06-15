import { type ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement } from "react";
import { AuthProvider } from "../features/auth";
import { NotificationHubBridge } from "../features/notification";
import { TooltipProvider } from "../shared/components/ui/Tooltip";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

type AppProvidersProps = {
  children: ReactNode;
};

const createQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
  });
};

export function AppProviders({ children }: AppProvidersProps): ReactElement {
  const [queryClient] = useState(createQueryClient);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="my-super-template-theme"
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <NotificationHubBridge />
            {children}
          </AuthProvider>
        </TooltipProvider>
        <Toaster richColors position="top-right" closeButton theme="system" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
