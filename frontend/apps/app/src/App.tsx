import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold text-sand-800">
            🦕 Dino-Atlas
          </h1>
          <p className="mt-4 text-lg text-sand-600 font-body">
            Bereit fuer die Expedition!
          </p>
        </div>
      </div>
    </QueryClientProvider>
  );
}
