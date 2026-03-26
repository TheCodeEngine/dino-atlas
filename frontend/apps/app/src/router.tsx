import { createBrowserRouter } from "react-router";
import { AuthGuard, PlayerGuard } from "@/components/AuthGuard";
import { AppLayout } from "@/components/AppLayout";
import { LoginPage } from "@/pages/LoginPage";
import { PlayerSelectPage } from "@/pages/PlayerSelectPage";
import { HomePage } from "@/pages/HomePage";

export const router = createBrowserRouter([
  // Public — no layout
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
              // TODO: /museum, /minigames, /story
            ],
          },

          // Fullscreen (no nav)
          // TODO: /expedition/*, /museum/:slug, /minigames/:type, /sleepy, /parent
        ],
      },
    ],
  },
]);
