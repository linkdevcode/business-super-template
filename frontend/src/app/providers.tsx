import { type ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement } from "react";
import { AuthProvider } from "../features/auth";
import { NotificationHubBridge } from "../features/notification";
import { Toaster } from "sonner";

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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationHubBridge />
        {children}
      </AuthProvider>
      <Toaster richColors position="top-right" closeButton />
    </QueryClientProvider>
  );
}
