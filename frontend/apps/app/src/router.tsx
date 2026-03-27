import { createBrowserRouter } from "react-router";
import { AuthGuard, PlayerGuard } from "@/components/AuthGuard";
import { AppLayout } from "@/components/AppLayout";

// Pages
import { LoginPage } from "@/pages/LoginPage";
import { PlayerSelectPage } from "@/pages/PlayerSelectPage";
import { HomePage } from "@/pages/HomePage";
import { ExpeditionIntroPage } from "@/pages/ExpeditionIntroPage";
import { ExcavationPage } from "@/pages/ExcavationPage";
import { SkeletonBreakPage } from "@/pages/SkeletonBreakPage";
import { PuzzlePage } from "@/pages/PuzzlePage";
import { IdentifyPage } from "@/pages/IdentifyPage";
import { DiscoveryPage } from "@/pages/DiscoveryPage";
import { MuseumPage } from "@/pages/MuseumPage";
import { MuseumDetailPage } from "@/pages/MuseumDetailPage";
import { MinigameSelectPage } from "@/pages/MinigameSelectPage";
import { MinigamePage } from "@/pages/MinigamePage";
import { SleepyDinosPage } from "@/pages/SleepyDinosPage";

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
              { path: "/minigames", element: <MinigameSelectPage /> },
            ],
          },

          // Fullscreen (no nav)
          { path: "/museum/:slug", element: <MuseumDetailPage /> },
          { path: "/minigames/:type", element: <MinigamePage /> },
          { path: "/sleepy", element: <SleepyDinosPage /> },
          { path: "/expedition/intro", element: <ExpeditionIntroPage /> },
          { path: "/expedition/excavation", element: <ExcavationPage /> },
          { path: "/expedition/skeleton-break", element: <SkeletonBreakPage /> },
          { path: "/expedition/puzzle", element: <PuzzlePage /> },
          { path: "/expedition/identify", element: <IdentifyPage /> },
          { path: "/expedition/discovery", element: <DiscoveryPage /> },
        ],
      },
    ],
  },
]);
