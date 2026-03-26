import { createBrowserRouter } from "react-router";
import { AuthGuard, PlayerGuard } from "@/components/AuthGuard";
import { AppLayout } from "@/components/AppLayout";

// Pages
import { LoginPage } from "@/pages/LoginPage";
import { PlayerSelectPage } from "@/pages/PlayerSelectPage";
import { HomePage } from "@/pages/HomePage";
import { ExpeditionIntroPage } from "@/pages/ExpeditionIntroPage";
import { ExcavationPage } from "@/pages/ExcavationPage";
import { PuzzlePage } from "@/pages/PuzzlePage";
import { IdentifyPage } from "@/pages/IdentifyPage";
import { DiscoveryPage } from "@/pages/DiscoveryPage";
import { MuseumPage } from "@/pages/MuseumPage";

export const router = createBrowserRouter([
  // Public
  { path: "/login", element: <LoginPage /> },

  // Authenticated
  {
    element: <AuthGuard />,
    children: [
      { path: "/players", element: <PlayerSelectPage /> },

      // Need active player
      {
        element: <PlayerGuard />,
        children: [
          // With AppShell (TopBar + BottomNav)
          {
            element: <AppLayout />,
            children: [
              { path: "/", element: <HomePage /> },
              { path: "/museum", element: <MuseumPage /> },
            ],
          },

          // Fullscreen (no nav) — Expedition flow
          { path: "/expedition/intro", element: <ExpeditionIntroPage /> },
          { path: "/expedition/excavation", element: <ExcavationPage /> },
          { path: "/expedition/puzzle", element: <PuzzlePage /> },
          { path: "/expedition/identify", element: <IdentifyPage /> },
          { path: "/expedition/discovery", element: <DiscoveryPage /> },
        ],
      },
    ],
  },
]);
