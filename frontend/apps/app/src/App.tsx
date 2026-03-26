import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-fixed border-4 border-on-surface rounded-2xl sticker-shadow mb-6">
            <span
              className="material-symbols-outlined text-4xl text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              explore
            </span>
          </div>
          <h1 className="text-4xl font-extrabold uppercase tracking-tight text-on-surface">
            Dino-Atlas
          </h1>
          <p className="mt-4 text-lg text-on-surface-variant font-medium">
            Bereit fuer die Expedition!
          </p>
        </div>
      </div>
    </QueryClientProvider>
  );
}
